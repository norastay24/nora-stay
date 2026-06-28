import {
  createDefaultAdminPopupSettings,
  type AdminPopupSettings,
  type AdminPopupTargetPage,
} from "@/app/admin/_components/popup/admin-popup-shared";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";

function normalizeTargetPages(value: unknown): AdminPopupTargetPage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (page): page is AdminPopupTargetPage =>
      page === "home" || page === "branches" || page === "experience",
  );
}

export function serializeAdminPopupSettings(settings: AdminPopupSettings) {
  return {
    id: "default",
    is_visible: settings.isVisible,
    title_ko: settings.titleKo.trim(),
    title_en: settings.titleEn.trim(),
    button_label_ko: settings.buttonLabelKo.trim(),
    button_label_en: settings.buttonLabelEn.trim(),
    description_ko: settings.descriptionKo.trim(),
    description_en: settings.descriptionEn.trim(),
    link_url: settings.linkUrl.trim(),
    target_pages: settings.targetPages,
    image_url: settings.imageUrl.trim(),
    updated_at: new Date().toISOString(),
  };
}

export function deserializeAdminPopupSettings(record: Record<string, unknown>): AdminPopupSettings {
  const fallback = createDefaultAdminPopupSettings();

  return {
    isVisible: typeof record.is_visible === "boolean" ? record.is_visible : fallback.isVisible,
    titleKo: typeof record.title_ko === "string" ? record.title_ko : fallback.titleKo,
    titleEn: typeof record.title_en === "string" ? record.title_en : fallback.titleEn,
    buttonLabelKo:
      typeof record.button_label_ko === "string" ? record.button_label_ko : fallback.buttonLabelKo,
    buttonLabelEn:
      typeof record.button_label_en === "string" ? record.button_label_en : fallback.buttonLabelEn,
    descriptionKo:
      typeof record.description_ko === "string" ? record.description_ko : fallback.descriptionKo,
    descriptionEn:
      typeof record.description_en === "string" ? record.description_en : fallback.descriptionEn,
    linkUrl: typeof record.link_url === "string" ? record.link_url : fallback.linkUrl,
    targetPages: normalizeTargetPages(record.target_pages),
    imageUrl: typeof record.image_url === "string" ? record.image_url : fallback.imageUrl,
  };
}

export async function fetchAdminPopupSettings() {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    return createDefaultAdminPopupSettings();
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/admin_popup_settings?id=eq.default&select=*&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      next: {
        revalidate: 60,
        tags: ["admin-popup-settings"],
      },
    },
  );

  if (!response.ok) {
    return createDefaultAdminPopupSettings();
  }

  const records = (await response.json()) as Array<Record<string, unknown>>;

  if (!records[0]) {
    return createDefaultAdminPopupSettings();
  }

  return deserializeAdminPopupSettings(records[0]);
}
