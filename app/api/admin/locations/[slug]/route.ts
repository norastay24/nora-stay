import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { LocationContent } from "@/lib/location-content";
import { getAdminSession } from "@/lib/auth/admin-session";
import { serializeLocationContent } from "@/lib/server/admin-location-content";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

async function upsertLocationRecord(
  supabaseUrl: string,
  serviceRoleKey: string,
  payload: ReturnType<typeof serializeLocationContent>,
) {
  return fetch(
    `${supabaseUrl}/rest/v1/admin_location_content?on_conflict=location_slug`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates, return=representation",
      },
      body: JSON.stringify(payload),
    },
  );
}

export async function POST(request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  try {
    const { draft } = (await request.json()) as { draft?: LocationContent };

    if (!draft || typeof draft !== "object") {
      return NextResponse.json({ error: "Invalid location payload." }, { status: 400 });
    }

    const response = await upsertLocationRecord(
      supabaseUrl,
      serviceRoleKey,
      serializeLocationContent(slug, draft),
    );

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        { error: "Failed to save location settings.", detail: errorText },
        { status: 500 },
      );
    }

    revalidateTag(`admin-location-content:${slug}`, "max");
    if (slug === "garosugil") {
      revalidateTag("admin-garosugil-content", "max");
      revalidatePath("/admin/garosugil");
      revalidatePath("/locations/garosugil");
    }
    revalidatePath(`/admin/locations/${slug}`);
    revalidatePath(`/locations/${slug}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
