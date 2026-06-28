import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { GarosugilContent } from "@/lib/garosugil-content";
import { getAdminSession } from "@/lib/auth/admin-session";
import { serializeGarosugilContent } from "@/lib/server/admin-garosugil-content";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";

async function updateGarosugilRecord(
  supabaseUrl: string,
  serviceRoleKey: string,
  payload: ReturnType<typeof serializeGarosugilContent>,
) {
  return fetch(`${supabaseUrl}/rest/v1/admin_location_garosugil_content?id=eq.garosugil`, {
    method: "PATCH",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });
}

async function insertGarosugilRecord(
  supabaseUrl: string,
  serviceRoleKey: string,
  payload: ReturnType<typeof serializeGarosugilContent>,
) {
  return fetch(`${supabaseUrl}/rest/v1/admin_location_garosugil_content`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });
}

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  try {
    const { draft } = (await request.json()) as { draft?: GarosugilContent };

    if (!draft || typeof draft !== "object") {
      return NextResponse.json({ error: "Invalid garosugil payload." }, { status: 400 });
    }

    const payload = serializeGarosugilContent(draft);
    let response = await updateGarosugilRecord(supabaseUrl, serviceRoleKey, payload);

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        { error: "Failed to save garosugil settings.", detail: errorText },
        { status: 500 },
      );
    }

    const records = (await response.json()) as Array<unknown>;

    if (records.length === 0) {
      response = await insertGarosugilRecord(supabaseUrl, serviceRoleKey, payload);

      if (!response.ok) {
        const errorText = await response.text();

        return NextResponse.json(
          { error: "Failed to create garosugil settings.", detail: errorText },
          { status: 500 },
        );
      }
    }

    revalidateTag("admin-garosugil-content", "max");
    revalidatePath("/admin/garosugil");
    revalidatePath("/locations/garosugil");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
