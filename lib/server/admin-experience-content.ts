import {
  createDefaultExperienceContent,
  type AdminExperienceCategory,
  type AdminExperienceContent,
  type AdminExperienceItem,
  type AdminExperiencePageSettings,
} from "@/app/admin/_components/experience/admin-experience-shared";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";

function deserializeSettings(record: Record<string, unknown>): AdminExperiencePageSettings {
  const fallback = createDefaultExperienceContent().settings;

  return {
    mainTitleKo:
      typeof record.main_title_ko === "string" ? record.main_title_ko : fallback.mainTitleKo,
    mainTitleEn:
      typeof record.main_title_en === "string" ? record.main_title_en : fallback.mainTitleEn,
    descriptionKo:
      typeof record.description_ko === "string"
        ? record.description_ko
        : fallback.descriptionKo,
    descriptionEn:
      typeof record.description_en === "string"
        ? record.description_en
        : fallback.descriptionEn,
  };
}

function deserializeCategory(record: Record<string, unknown>): AdminExperienceCategory {
  return {
    id: String(record.id ?? ""),
    slug: String(record.slug ?? ""),
    titleKo: String(record.title_ko ?? ""),
    titleEn: String(record.title_en ?? ""),
    subtitleKo: String(record.subtitle_ko ?? ""),
    subtitleEn: String(record.subtitle_en ?? ""),
    descriptionKo: String(record.description_ko ?? ""),
    descriptionEn: String(record.description_en ?? ""),
    isVisible: Boolean(record.is_visible),
    sortOrder: Number(record.sort_order ?? 0),
  };
}

function deserializeItem(record: Record<string, unknown>): AdminExperienceItem {
  return {
    id: String(record.id ?? ""),
    categoryId: String(record.category_id ?? ""),
    titleKo: String(record.title_ko ?? ""),
    titleEn: String(record.title_en ?? ""),
    descriptionKo: String(record.description_ko ?? ""),
    descriptionEn: String(record.description_en ?? ""),
    imageUrl: String(record.image_url ?? ""),
    isVisible: Boolean(record.is_visible),
    sortOrder: Number(record.sort_order ?? 0),
  };
}

export function serializeExperienceSettings(settings: AdminExperiencePageSettings) {
  return {
    id: "default",
    main_title_ko: settings.mainTitleKo.trim(),
    main_title_en: settings.mainTitleEn.trim(),
    description_ko: settings.descriptionKo.trim(),
    description_en: settings.descriptionEn.trim(),
    updated_at: new Date().toISOString(),
  };
}

export function serializeExperienceCategory(category: AdminExperienceCategory) {
  return {
    id: category.id,
    slug: category.slug.trim(),
    title_ko: category.titleKo.trim(),
    title_en: category.titleEn.trim(),
    subtitle_ko: category.subtitleKo.trim(),
    subtitle_en: category.subtitleEn.trim(),
    description_ko: category.descriptionKo.trim(),
    description_en: category.descriptionEn.trim(),
    is_visible: category.isVisible,
    sort_order: category.sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function serializeExperienceItem(item: AdminExperienceItem) {
  return {
    id: item.id,
    category_id: item.categoryId,
    title_ko: item.titleKo.trim(),
    title_en: item.titleEn.trim(),
    description_ko: item.descriptionKo.trim(),
    description_en: item.descriptionEn.trim(),
    image_url: item.imageUrl.trim(),
    is_visible: item.isVisible,
    sort_order: item.sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchAdminExperienceContent(): Promise<AdminExperienceContent> {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();
  const fallback = createDefaultExperienceContent();

  if (!supabaseUrl || !serviceRoleKey) {
    return fallback;
  }

  const [settingsResponse, categoriesResponse, itemsResponse] = await Promise.all([
    fetch(
      `${supabaseUrl}/rest/v1/admin_experience_page_settings?id=eq.default&select=*&limit=1`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        next: {
          revalidate: 60,
          tags: ["admin-experience-content"],
        },
      },
    ),
    fetch(
      `${supabaseUrl}/rest/v1/admin_experience_categories?select=*&order=sort_order.asc,created_at.asc`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        next: {
          revalidate: 60,
          tags: ["admin-experience-content"],
        },
      },
    ),
    fetch(
      `${supabaseUrl}/rest/v1/admin_experience_items?select=*&order=sort_order.asc,created_at.asc`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        next: {
          revalidate: 60,
          tags: ["admin-experience-content"],
        },
      },
    ),
  ]);

  if (!settingsResponse.ok || !categoriesResponse.ok || !itemsResponse.ok) {
    return fallback;
  }

  const settingsRecords = (await settingsResponse.json()) as Array<Record<string, unknown>>;
  const categoryRecords = (await categoriesResponse.json()) as Array<Record<string, unknown>>;
  const itemRecords = (await itemsResponse.json()) as Array<Record<string, unknown>>;

  if (categoryRecords.length === 0 || itemRecords.length === 0) {
    return fallback;
  }

  return {
    settings: settingsRecords[0] ? deserializeSettings(settingsRecords[0]) : fallback.settings,
    categories: categoryRecords.map(deserializeCategory),
    items: itemRecords.map(deserializeItem),
  };
}
