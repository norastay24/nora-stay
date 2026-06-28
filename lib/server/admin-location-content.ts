import {
  createDefaultLocationContent,
  type LocationContent,
  type LocationFloorGuideCard,
  type LocationGalleryCategory,
  type LocationGallerySlide,
  type LocationMoment,
  type LocationRoomCategory,
  type LocationSpecItem,
} from "@/lib/location-content";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asLines(value: unknown, fallback: string[] = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.filter((item): item is string => typeof item === "string");
}

function asRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function normalizeSpecs(value: unknown, fallback: LocationSpecItem[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item, index) => {
      const record = asRecord(item);

      if (!record) {
        return null;
      }

      return {
        id: asString(record.id, `spec-${index + 1}`),
        label: asString(record.label),
        labelEn: asString(record.labelEn),
        value: asString(record.value),
        valueEn: asString(record.valueEn),
        description: asString(record.description),
        descriptionEn: asString(record.descriptionEn),
      };
    })
    .filter(Boolean) as LocationSpecItem[];

  return items.length > 0 ? items : fallback;
}

function normalizeGallerySlides(value: unknown): LocationGallerySlide[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => {
      const record = asRecord(item);

      if (!record) {
        return null;
      }

      return {
        id: asString(record.id, `slide-${index + 1}`),
        title: asString(record.title),
        titleEn: asString(record.titleEn),
        imageSrc: asString(record.imageSrc),
        imageAlt: asString(record.imageAlt),
      };
    })
    .filter(Boolean) as LocationGallerySlide[];
}

function normalizeGalleryCategories(value: unknown, fallback: LocationGalleryCategory[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item, index) => {
      const record = asRecord(item);

      if (!record) {
        return null;
      }

      const rawSlides = Array.isArray(record.slides) ? record.slides : [];
      const firstSlideRecord = asRecord(rawSlides[0]);

      return {
        id: asString(record.id, `category-${index + 1}`),
        label: asString(record.label),
        labelEn: asString(record.labelEn),
        description: asString(record.description, asString(firstSlideRecord?.description)),
        descriptionEn: asString(record.descriptionEn),
        slides: normalizeGallerySlides(record.slides),
      };
    })
    .filter((item) => Boolean(item) && (item as LocationGalleryCategory).slides.length > 0) as LocationGalleryCategory[];

  return items.length > 0 ? items : fallback;
}

function normalizeFloorCards(value: unknown, fallback: LocationFloorGuideCard[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item, index) => {
      const record = asRecord(item);

      if (!record) {
        return null;
      }

      return {
        id: asString(record.id, `floor-card-${index + 1}`),
        eyebrow: asString(record.eyebrow),
        eyebrowEn: asString(record.eyebrowEn),
        title: asString(record.title),
        titleEn: asString(record.titleEn),
        description: asLines(record.description),
        descriptionEn: asLines(record.descriptionEn),
        imageSrc: asString(record.imageSrc),
        imageAlt: asString(record.imageAlt),
        size: record.size === "wide" ? "wide" : "large",
      };
    })
    .filter(Boolean) as LocationFloorGuideCard[];

  return items.length > 0 ? items : fallback;
}

function normalizeRoomCategories(value: unknown, fallback: LocationRoomCategory[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item, index) => {
      const record = asRecord(item);

      if (!record) {
        return null;
      }

      return {
        id: asString(record.id, `room-${index + 1}`),
        eyebrow: asString(record.eyebrow),
        eyebrowEn: asString(record.eyebrowEn),
        title: asString(record.title),
        titleEn: asString(record.titleEn),
        description: asLines(record.description),
        descriptionEn: asLines(record.descriptionEn),
        imageSrc: asString(record.imageSrc),
        imageAlt: asString(record.imageAlt),
      };
    })
    .filter(Boolean) as LocationRoomCategory[];

  return items.length > 0 ? items : fallback;
}

function normalizeMoments(value: unknown, fallback: LocationMoment[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item, index) => {
      const record = asRecord(item);

      if (!record) {
        return null;
      }

      return {
        id: asString(record.id, `moment-${index + 1}`),
        icon: asString(record.icon),
        title: asString(record.title),
        titleEn: asString(record.titleEn),
        description: asLines(record.description),
        descriptionEn: asLines(record.descriptionEn),
      };
    })
    .filter(Boolean) as LocationMoment[];

  return items.length > 0 ? items : fallback;
}

export function serializeLocationContent(locationSlug: string, content: LocationContent) {
  return {
    location_slug: locationSlug,
    content,
    updated_at: new Date().toISOString(),
  };
}

export function deserializeLocationContent(record: Record<string, unknown>): LocationContent {
  const fallback = createDefaultLocationContent();
  const content = asRecord(record.content);

  if (!content) {
    return fallback;
  }

  const hero = asRecord(content.hero);
  const gallery = asRecord(content.gallery);
  const floorGuide = asRecord(content.floorGuide);
  const roomCategories = asRecord(content.roomCategories);
  const moments = asRecord(content.moments);
  const philosophy = asRecord(content.philosophy);

  return {
    hero: {
      eyebrow: asString(hero?.eyebrow, fallback.hero.eyebrow),
      eyebrowEn: asString(hero?.eyebrowEn, fallback.hero.eyebrowEn),
      badge: asString(hero?.badge, fallback.hero.badge),
      title: asLines(hero?.title, fallback.hero.title),
      titleEn: asLines(hero?.titleEn, fallback.hero.titleEn),
      description: asLines(hero?.description, fallback.hero.description),
      descriptionEn: asLines(hero?.descriptionEn, fallback.hero.descriptionEn),
      bookingHref: asString(hero?.bookingHref, fallback.hero.bookingHref),
      bookingLabel: asString(hero?.bookingLabel, fallback.hero.bookingLabel),
      bookingLabelEn: asString(hero?.bookingLabelEn, fallback.hero.bookingLabelEn),
      mapHref: asString(hero?.mapHref, fallback.hero.mapHref),
      mapLabel: asString(hero?.mapLabel, fallback.hero.mapLabel),
      mapLabelEn: asString(hero?.mapLabelEn, fallback.hero.mapLabelEn),
      imageSrc: asString(hero?.imageSrc, fallback.hero.imageSrc),
      imageAlt: asString(hero?.imageAlt, fallback.hero.imageAlt),
    },
    specs: normalizeSpecs(content.specs, fallback.specs),
    gallery: {
      eyebrow: asString(gallery?.eyebrow, fallback.gallery.eyebrow),
      eyebrowEn: asString(gallery?.eyebrowEn, fallback.gallery.eyebrowEn),
      title: asString(gallery?.title, fallback.gallery.title),
      titleEn: asString(gallery?.titleEn, fallback.gallery.titleEn),
      categories: normalizeGalleryCategories(gallery?.categories, fallback.gallery.categories),
    },
    floorGuide: {
      eyebrow: asString(floorGuide?.eyebrow, fallback.floorGuide.eyebrow),
      eyebrowEn: asString(floorGuide?.eyebrowEn, fallback.floorGuide.eyebrowEn),
      title: asString(floorGuide?.title, fallback.floorGuide.title),
      titleEn: asString(floorGuide?.titleEn, fallback.floorGuide.titleEn),
      description: asString(floorGuide?.description, fallback.floorGuide.description),
      descriptionEn: asString(floorGuide?.descriptionEn, fallback.floorGuide.descriptionEn),
      cards: normalizeFloorCards(floorGuide?.cards, fallback.floorGuide.cards),
    },
    roomCategories: {
      eyebrow: asString(roomCategories?.eyebrow, fallback.roomCategories.eyebrow),
      eyebrowEn: asString(roomCategories?.eyebrowEn, fallback.roomCategories.eyebrowEn),
      title: asString(roomCategories?.title, fallback.roomCategories.title),
      titleEn: asString(roomCategories?.titleEn, fallback.roomCategories.titleEn),
      description: asString(roomCategories?.description, fallback.roomCategories.description),
      descriptionEn: asString(roomCategories?.descriptionEn, fallback.roomCategories.descriptionEn),
      items: normalizeRoomCategories(roomCategories?.items, fallback.roomCategories.items),
    },
    moments: {
      eyebrow: asString(moments?.eyebrow, fallback.moments.eyebrow),
      eyebrowEn: asString(moments?.eyebrowEn, fallback.moments.eyebrowEn),
      title: asString(moments?.title, fallback.moments.title),
      titleEn: asString(moments?.titleEn, fallback.moments.titleEn),
      items: normalizeMoments(moments?.items, fallback.moments.items),
    },
    philosophy: {
      eyebrow: asString(philosophy?.eyebrow, fallback.philosophy.eyebrow),
      eyebrowEn: asString(philosophy?.eyebrowEn, fallback.philosophy.eyebrowEn),
      title: asLines(philosophy?.title, fallback.philosophy.title),
      titleEn: asLines(philosophy?.titleEn, fallback.philosophy.titleEn),
      description: asLines(philosophy?.description, fallback.philosophy.description),
      descriptionEn: asLines(philosophy?.descriptionEn, fallback.philosophy.descriptionEn),
      brandHref: asString(philosophy?.brandHref, fallback.philosophy.brandHref),
      brandLabel: asString(philosophy?.brandLabel, fallback.philosophy.brandLabel),
      brandLabelEn: asString(philosophy?.brandLabelEn, fallback.philosophy.brandLabelEn),
      bookingHref: asString(philosophy?.bookingHref, fallback.philosophy.bookingHref),
      bookingLabel: asString(philosophy?.bookingLabel, fallback.philosophy.bookingLabel),
      bookingLabelEn: asString(philosophy?.bookingLabelEn, fallback.philosophy.bookingLabelEn),
      imageSrc: asString(philosophy?.imageSrc, fallback.philosophy.imageSrc),
      imageAlt: asString(philosophy?.imageAlt, fallback.philosophy.imageAlt),
      overlayText: asString(philosophy?.overlayText, fallback.philosophy.overlayText),
      overlayTextEn: asString(philosophy?.overlayTextEn, fallback.philosophy.overlayTextEn),
    },
  };
}

async function fetchFromGenericTable(locationSlug: string) {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/admin_location_content?location_slug=eq.${encodeURIComponent(locationSlug)}&select=*&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      next: {
        revalidate: 60,
        tags: [`admin-location-content:${locationSlug}`],
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  const records = (await response.json()) as Array<Record<string, unknown>>;
  return records[0] ?? null;
}

async function fetchFromLegacyGarosugilTable() {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/admin_location_garosugil_content?id=eq.garosugil&select=*&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      next: {
        revalidate: 60,
        tags: ["admin-garosugil-content", "admin-location-content:garosugil"],
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  const records = (await response.json()) as Array<Record<string, unknown>>;
  return records[0] ?? null;
}

export async function fetchAdminLocationContent(locationSlug: string) {
  const fallback = createDefaultLocationContent();
  const genericRecord = await fetchFromGenericTable(locationSlug);

  if (genericRecord) {
    return deserializeLocationContent(genericRecord);
  }

  if (locationSlug === "garosugil") {
    const legacyRecord = await fetchFromLegacyGarosugilTable();

    if (legacyRecord) {
      return deserializeLocationContent(legacyRecord);
    }
  }

  return fallback;
}
