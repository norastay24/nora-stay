import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { AdminPopupSettings } from "@/app/admin/_components/popup/admin-popup-shared";
import { getAdminSession } from "@/lib/auth/admin-session";
import { serializeAdminPopupSettings } from "@/lib/server/admin-popup-settings";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";

function validateAdminPopupSettings(settings: AdminPopupSettings) {
  return Array.isArray(settings.targetPages);
}

async function updatePopupRecord(
  supabaseUrl: string,
  serviceRoleKey: string,
  payload: ReturnType<typeof serializeAdminPopupSettings>,
) {
  return fetch(`${supabaseUrl}/rest/v1/admin_popup_settings?id=eq.default`, {
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

async function insertPopupRecord(
  supabaseUrl: string,
  serviceRoleKey: string,
  payload: ReturnType<typeof serializeAdminPopupSettings>,
) {
  return fetch(`${supabaseUrl}/rest/v1/admin_popup_settings`, {
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
    const { settings } = (await request.json()) as { settings?: AdminPopupSettings };

    if (!settings || !validateAdminPopupSettings(settings)) {
      return NextResponse.json({ error: "Invalid popup payload." }, { status: 400 });
    }

    const payload = serializeAdminPopupSettings(settings);
    let response = await updatePopupRecord(supabaseUrl, serviceRoleKey, payload);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Failed to save popup settings.", detail: errorText },
        { status: 500 },
      );
    }

    const records = (await response.json()) as Array<unknown>;

    if (records.length === 0) {
      response = await insertPopupRecord(supabaseUrl, serviceRoleKey, payload);

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: "Failed to create popup settings.", detail: errorText },
          { status: 500 },
        );
      }
    }

    revalidateTag("admin-popup-settings", "max");
    revalidatePath("/admin/popup");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
