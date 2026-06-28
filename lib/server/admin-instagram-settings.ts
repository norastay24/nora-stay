import { randomUUID } from "node:crypto";
import {
  createDefaultInstagramDraft,
  type InstagramDraft,
  type InstagramSlideImage,
} from "@/app/admin/_components/instagram/admin-instagram-shared";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";

function normalizeSlideImages(value: unknown): InstagramSlideImage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const url = typeof record.url === "string" ? record.url.trim() : "";

      if (!url) {
        return null;
      }

      return {
        id:
          typeof record.id === "string" && record.id.trim().length > 0
            ? record.id
            : randomUUID(),
        url,
        label: typeof record.label === "string" ? record.label : "",
      };
    })
    .filter((item): item is InstagramSlideImage => item !== null);
}

export function serializeInstagramDraft(draft: InstagramDraft) {
  return {
    id: "default",
    campaign_id: draft.campaignId.trim(),
    buddy_link_ko: draft.buddyLinkKo.trim(),
    buddy_link_en: draft.buddyLinkEn.trim(),
    footer_ko: draft.footerKo.trim(),
    footer_en: draft.footerEn.trim(),
    slide_images: draft.images.map((image, index) => ({
      id: image.id || randomUUID(),
      url: image.url.trim(),
      label: image.label.trim() || `Slide #${index + 1}`,
    })),
    updated_at: new Date().toISOString(),
  };
}

export function deserializeInstagramDraft(record: Record<string, unknown>): InstagramDraft {
  const fallback = createDefaultInstagramDraft();

  return {
    campaignId: typeof record.campaign_id === "string" ? record.campaign_id : fallback.campaignId,
    buddyLinkKo:
      typeof record.buddy_link_ko === "string" ? record.buddy_link_ko : fallback.buddyLinkKo,
    buddyLinkEn:
      typeof record.buddy_link_en === "string" ? record.buddy_link_en : fallback.buddyLinkEn,
    footerKo: typeof record.footer_ko === "string" ? record.footer_ko : fallback.footerKo,
    footerEn: typeof record.footer_en === "string" ? record.footer_en : fallback.footerEn,
    images: normalizeSlideImages(record.slide_images),
  };
}

export async function fetchAdminInstagramDraft() {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    return createDefaultInstagramDraft();
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/admin_instagram_settings?id=eq.default&select=*&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      next: {
        revalidate: 60,
        tags: ["admin-instagram-settings"],
      },
    },
  );

  if (!response.ok) {
    return createDefaultInstagramDraft();
  }

  const records = (await response.json()) as Array<Record<string, unknown>>;

  if (!records[0]) {
    return createDefaultInstagramDraft();
  }

  return deserializeInstagramDraft(records[0]);
}
