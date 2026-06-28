import {
  createDefaultAdminHomeSettings,
  type AdminHomeSettings,
} from "@/app/admin/_components/home/admin-home-shared";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";

export function serializeAdminHomeSettings(settings: AdminHomeSettings) {
  return {
    id: "default",
    booking_url: settings.bookingUrl.trim() || "#",
    updated_at: new Date().toISOString(),
  };
}

export function deserializeAdminHomeSettings(record: Record<string, unknown>): AdminHomeSettings {
  const fallback = createDefaultAdminHomeSettings();

  return {
    bookingUrl:
      typeof record.booking_url === "string" && record.booking_url.trim()
        ? record.booking_url
        : fallback.bookingUrl,
  };
}

export async function fetchAdminHomeSettings() {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    return createDefaultAdminHomeSettings();
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/admin_home_settings?id=eq.default&select=*&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      next: {
        revalidate: 60,
        tags: ["admin-home-settings"],
      },
    },
  );

  if (!response.ok) {
    return createDefaultAdminHomeSettings();
  }

  const records = (await response.json()) as Array<Record<string, unknown>>;

  if (!records[0]) {
    return createDefaultAdminHomeSettings();
  }

  return deserializeAdminHomeSettings(records[0]);
}
