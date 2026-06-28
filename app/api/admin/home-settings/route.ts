import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { AdminHomeSettings } from "@/app/admin/_components/home/admin-home-shared";
import { getAdminSession } from "@/lib/auth/admin-session";
import { serializeAdminHomeSettings } from "@/lib/server/admin-home-settings";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";

function validateAdminHomeSettings(settings: AdminHomeSettings) {
  return typeof settings.bookingUrl === "string";
}

async function updateHomeSettingsRecord(
  supabaseUrl: string,
  serviceRoleKey: string,
  payload: ReturnType<typeof serializeAdminHomeSettings>,
) {
  return fetch(`${supabaseUrl}/rest/v1/admin_home_settings?id=eq.default`, {
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

async function insertHomeSettingsRecord(
  supabaseUrl: string,
  serviceRoleKey: string,
  payload: ReturnType<typeof serializeAdminHomeSettings>,
) {
  return fetch(`${supabaseUrl}/rest/v1/admin_home_settings`, {
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
    const { settings } = (await request.json()) as { settings?: AdminHomeSettings };

    if (!settings || !validateAdminHomeSettings(settings)) {
      return NextResponse.json({ error: "Invalid home settings payload." }, { status: 400 });
    }

    const payload = serializeAdminHomeSettings(settings);
    let response = await updateHomeSettingsRecord(supabaseUrl, serviceRoleKey, payload);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Failed to save home settings.", detail: errorText },
        { status: 500 },
      );
    }

    const records = (await response.json()) as Array<unknown>;

    if (records.length === 0) {
      response = await insertHomeSettingsRecord(supabaseUrl, serviceRoleKey, payload);

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: "Failed to create home settings.", detail: errorText },
          { status: 500 },
        );
      }
    }

    revalidateTag("admin-home-settings", "max");
    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
