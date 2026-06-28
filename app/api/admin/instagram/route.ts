import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { InstagramDraft } from "@/app/admin/_components/instagram/admin-instagram-shared";
import { getAdminSession } from "@/lib/auth/admin-session";
import { serializeInstagramDraft } from "@/lib/server/admin-instagram-settings";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";

function validateInstagramDraft(draft: InstagramDraft) {
  return Array.isArray(draft.images);
}

async function updateInstagramRecord(
  supabaseUrl: string,
  serviceRoleKey: string,
  payload: ReturnType<typeof serializeInstagramDraft>,
) {
  return fetch(`${supabaseUrl}/rest/v1/admin_instagram_settings?id=eq.default`, {
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

async function insertInstagramRecord(
  supabaseUrl: string,
  serviceRoleKey: string,
  payload: ReturnType<typeof serializeInstagramDraft>,
) {
  return fetch(`${supabaseUrl}/rest/v1/admin_instagram_settings`, {
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
    const { draft } = (await request.json()) as { draft?: InstagramDraft };

    if (!draft || !validateInstagramDraft(draft)) {
      return NextResponse.json({ error: "Invalid instagram payload." }, { status: 400 });
    }

    const payload = serializeInstagramDraft(draft);
    let response = await updateInstagramRecord(supabaseUrl, serviceRoleKey, payload);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Failed to save instagram settings.", detail: errorText },
        { status: 500 },
      );
    }

    const records = (await response.json()) as Array<unknown>;

    if (records.length === 0) {
      response = await insertInstagramRecord(supabaseUrl, serviceRoleKey, payload);

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: "Failed to create instagram settings.", detail: errorText },
          { status: 500 },
        );
      }
    }

    revalidateTag("admin-instagram-settings", "max");
    revalidatePath("/admin/instagram");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
