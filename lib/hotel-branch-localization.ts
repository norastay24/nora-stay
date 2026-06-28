import type {
  AdminHotelBranch,
  HotelCategoryTag,
} from "@/app/admin/_components/hotels/admin-hotels-shared";
import { getLocalizedValue, type AppLocale } from "@/lib/i18n";

const categoryTagMessages: Record<string, Record<AppLocale, string>> = {
  concept_hotel: {
    ko: "컨셉호텔",
    en: "Concept Hotel",
  },
  spa_sauna: {
    ko: "스파사우나",
    en: "Spa & Sauna",
  },
  entertainment: {
    ko: "엔터테인먼트",
    en: "Entertainment",
  },
  dining: {
    ko: "다이닝",
    en: "Dining",
  },
  private_house: {
    ko: "프라이빗독채",
    en: "Private House",
  },
  garden_terrace: {
    ko: "정원테라스",
    en: "Garden & Terrace",
  },
  wellness: {
    ko: "웰니스",
    en: "Wellness",
  },
};

const regionMessages: Record<string, Record<AppLocale, string>> = {
  seoul: { ko: "서울", en: "Seoul" },
  gyeonggi: { ko: "경기", en: "Gyeonggi" },
  daejeon: { ko: "대전", en: "Daejeon" },
  chungcheong: { ko: "충청", en: "Chungcheong" },
  incheon: { ko: "인천", en: "Incheon" },
  gyeongsang: { ko: "경상", en: "Gyeongsang" },
  jeolla: { ko: "전라", en: "Jeolla" },
  gangwon: { ko: "강원", en: "Gangwon" },
  busan: { ko: "부산", en: "Busan" },
};

export function normalizeHotelCategoryKey(tag: string) {
  const normalized = tag.trim().toLowerCase();

  if (normalized.includes("concept") || normalized.includes("컨셉") || normalized.includes("컨셉")) {
    return "concept_hotel";
  }

  if (
    normalized.includes("spa") ||
    normalized.includes("sauna") ||
    normalized.includes("스파") ||
    normalized.includes("사우나")
  ) {
    return "spa_sauna";
  }

  if (
    normalized.includes("entertainment") ||
    normalized.includes("entertain") ||
    normalized.includes("엔터")
  ) {
    return "entertainment";
  }

  if (normalized.includes("dining") || normalized.includes("다이닝")) {
    return "dining";
  }

  if (
    normalized.includes("private") ||
    normalized.includes("프라이빗") ||
    normalized.includes("독채")
  ) {
    return "private_house";
  }

  if (
    normalized.includes("garden") ||
    normalized.includes("terrace") ||
    normalized.includes("정원") ||
    normalized.includes("테라스")
  ) {
    return "garden_terrace";
  }

  if (normalized.includes("wellness") || normalized.includes("웰니스")) {
    return "wellness";
  }

  return normalized;
}

function normalizeRegionKey(regionLabel: string) {
  const trimmed = regionLabel.trim().toLowerCase();

  if (trimmed.includes("seoul") || trimmed.includes("서울")) return "seoul";
  if (trimmed.includes("gyeonggi") || trimmed.includes("경기")) return "gyeonggi";
  if (trimmed.includes("daejeon") || trimmed.includes("대전")) return "daejeon";
  if (trimmed.includes("chungcheong") || trimmed.includes("충청")) return "chungcheong";
  if (trimmed.includes("incheon") || trimmed.includes("인천")) return "incheon";
  if (trimmed.includes("gyeongsang") || trimmed.includes("경상")) return "gyeongsang";
  if (trimmed.includes("jeolla") || trimmed.includes("전라")) return "jeolla";
  if (trimmed.includes("gangwon") || trimmed.includes("강원")) return "gangwon";
  if (trimmed.includes("busan") || trimmed.includes("부산")) return "busan";

  return trimmed;
}

export function normalizeHotelRegionLabel(regionLabel: string) {
  const key = normalizeRegionKey(regionLabel);
  return regionMessages[key]?.ko ?? (regionLabel.trim() || "서울");
}

export function getLocalizedHotelRegionLabel(locale: AppLocale, regionLabel: string) {
  const key = normalizeRegionKey(regionLabel);
  const message = regionMessages[key];

  if (!message) {
    return regionLabel.trim();
  }

  return message[locale] ?? message.ko;
}

export function getLocalizedHotelCategoryTag(locale: AppLocale, tag: HotelCategoryTag | string) {
  const key = normalizeHotelCategoryKey(tag);
  const message = categoryTagMessages[key];

  if (!message) {
    return tag;
  }

  return message[locale] ?? message.ko;
}

export function canonicalizeHotelCategoryTag(tag: HotelCategoryTag | string) {
  const key = normalizeHotelCategoryKey(tag);
  const message = categoryTagMessages[key];

  if (!message) {
    return tag.trim();
  }

  return message.ko;
}

export function getLocalizedHotelName(
  locale: AppLocale,
  branch: Pick<AdminHotelBranch, "name" | "summary">,
) {
  return getLocalizedValue(locale, branch.name, branch.summary);
}

export function getLocalizedHotelAddress(
  locale: AppLocale,
  branch: Pick<AdminHotelBranch, "address" | "addressEn">,
) {
  return getLocalizedValue(locale, branch.address, branch.addressEn);
}

export function getLocalizedHotelDescription(
  locale: AppLocale,
  branch: Pick<AdminHotelBranch, "description" | "descriptionEn" | "summary">,
) {
  return getLocalizedValue(locale, branch.description || branch.summary, branch.descriptionEn);
}

export function getLocalizedHotelAmenities(
  locale: AppLocale,
  branch: Pick<AdminHotelBranch, "amenityNotes" | "amenityNotesEn">,
) {
  const englishNotes =
    locale === "en" && branch.amenityNotesEn.some((note) => note.trim().length > 0)
      ? branch.amenityNotesEn
      : branch.amenityNotes;

  return englishNotes.filter((note) => note.trim().length > 0);
}

export function formatHotelHours(locale: AppLocale, checkInTime: string, checkOutTime: string) {
  if (locale === "en") {
    return `Check-in ${checkInTime} / Check-out ${checkOutTime}`;
  }

  return `체크인 ${checkInTime} / 체크아웃 ${checkOutTime}`;
}
