import type { AppLocale } from "@/lib/i18n";
import {
  formatHotelHours,
  normalizeHotelRegionLabel,
} from "@/lib/hotel-branch-localization";
import { translateKeyedValue } from "@/lib/keyed-translations";
import type { TranslationDictionaryMap } from "@/lib/translation-dictionary";
import {
  hotelThemeColorMap,
  type AdminHotelBranch,
  type HotelColorTheme,
} from "@/app/admin/_components/hotels/admin-hotels-shared";

export type BranchTag = string;

export interface BranchItem {
  id: string;
  slug: string;
  name: string;
  englishName: string;
  badge: "NEW" | "BEST";
  isOperating: boolean;
  themeColor: string;
  address: string;
  addressEn: string;
  checkInTime: string;
  checkOutTime: string;
  tags: BranchTag[];
  imageSrc: string;
  imageSources: string[];
  href: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  reservationHref: string;
  description: string;
  descriptionEn: string;
  features: string[];
  featuresEn: string[];
}

const regionFallbackCoordinates: Record<string, { lat: number; lng: number }> = {
  서울: { lat: 37.5665, lng: 126.978 },
  경기: { lat: 37.4138, lng: 127.5183 },
  인천: { lat: 37.4563, lng: 126.7052 },
  대전: { lat: 36.3504, lng: 127.3845 },
  충청: { lat: 36.6357, lng: 127.4917 },
  경상: { lat: 35.5384, lng: 129.3114 },
  전라: { lat: 35.8242, lng: 127.148 },
  강원: { lat: 37.8228, lng: 128.1555 },
  부산: { lat: 35.1796, lng: 129.0756 },
};

function resolveCoordinates(branch: AdminHotelBranch) {
  if (typeof branch.latitude === "number" && typeof branch.longitude === "number") {
    return {
      lat: branch.latitude,
      lng: branch.longitude,
    };
  }

  return (
    regionFallbackCoordinates[normalizeHotelRegionLabel(branch.regionLabel)] ??
    regionFallbackCoordinates.서울
  );
}

function resolveImageSrc(branch: AdminHotelBranch) {
  return branch.images[0]?.url || "/images/section-images/가로수길점.jpg";
}

function resolveImageSources(branch: AdminHotelBranch) {
  const imageSources = branch.images.map((image) => image.url).filter(Boolean);

  return imageSources.length > 0 ? imageSources : ["/images/section-images/가로수길점.jpg"];
}

function resolveHref(branch: AdminHotelBranch) {
  if (branch.previewLink.startsWith("/")) {
    return branch.previewLink;
  }

  return `/locations/${branch.slug}`;
}

function resolveThemeColor(branch: AdminHotelBranch) {
  const primaryTheme = branch.colorThemes[0] as HotelColorTheme | undefined;

  if (primaryTheme && hotelThemeColorMap[primaryTheme]) {
    return hotelThemeColorMap[primaryTheme];
  }

  return hotelThemeColorMap["Nora Brown"];
}

export function getBranchDisplayName(branch: BranchItem, locale: AppLocale) {
  return getBranchDisplayNameWithTranslations(branch, locale, {});
}

export function getBranchDisplayAddress(branch: BranchItem, locale: AppLocale) {
  return getBranchDisplayAddressWithTranslations(branch, locale, {});
}

export function getBranchDisplayHours(branch: BranchItem, locale: AppLocale) {
  return formatHotelHours(locale, branch.checkInTime, branch.checkOutTime);
}

export function getBranchDisplayDescription(branch: BranchItem, locale: AppLocale) {
  return getBranchDisplayDescriptionWithTranslations(branch, locale, {});
}

export function getBranchDisplayFeatures(branch: BranchItem, locale: AppLocale) {
  return getBranchDisplayFeaturesWithTranslations(branch, locale, {});
}

export function getBranchDisplayNameWithTranslations(
  branch: BranchItem,
  locale: AppLocale,
  translations: TranslationDictionaryMap,
) {
  return translateKeyedValue(
    locale,
    translations,
    `branch.${branch.slug}.name`,
    branch.name,
    branch.englishName,
  );
}

export function getBranchDisplayAddressWithTranslations(
  branch: BranchItem,
  locale: AppLocale,
  translations: TranslationDictionaryMap,
) {
  return translateKeyedValue(
    locale,
    translations,
    `branch.${branch.slug}.address`,
    branch.address,
    branch.addressEn,
  );
}

export function getBranchDisplayDescriptionWithTranslations(
  branch: BranchItem,
  locale: AppLocale,
  translations: TranslationDictionaryMap,
) {
  return translateKeyedValue(
    locale,
    translations,
    `branch.${branch.slug}.description`,
    branch.description,
    branch.descriptionEn,
  );
}

export function getBranchDisplayFeaturesWithTranslations(
  branch: BranchItem,
  locale: AppLocale,
  translations: TranslationDictionaryMap,
) {
  return branch.features.map((feature, index) =>
    translateKeyedValue(
      locale,
      translations,
      `branch.${branch.slug}.feature.${index + 1}`,
      feature,
      branch.featuresEn[index],
    ),
  );
}

export function buildBranchItems(branches: AdminHotelBranch[]): BranchItem[] {
  return branches
    .filter((branch) => branch.isVisible)
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((branch) => ({
      id: branch.id,
      slug: branch.slug,
      name: branch.name,
      englishName: branch.summary.trim() || branch.name,
      badge: branch.isFeatured ? "BEST" : "NEW",
      isOperating: branch.isFeatured,
      themeColor: resolveThemeColor(branch),
      address: branch.address,
      addressEn: branch.addressEn,
      checkInTime: branch.checkInTime,
      checkOutTime: branch.checkOutTime,
      tags: branch.categoryTags.filter(Boolean),
      imageSrc: resolveImageSrc(branch),
      imageSources: resolveImageSources(branch),
      href: resolveHref(branch),
      coordinates: resolveCoordinates(branch),
      reservationHref: branch.bookingUrl || "#",
      description: branch.description || branch.summary,
      descriptionEn: branch.descriptionEn,
      features: branch.amenityNotes.filter(Boolean),
      featuresEn: branch.amenityNotesEn.filter(Boolean),
    }));
}

export function buildBranchFilterTags(branches: BranchItem[]) {
  return Array.from(new Set(branches.flatMap((branch) => branch.tags).filter(Boolean)));
}

export function buildPreparingBranchItem(branch: AdminHotelBranch): BranchItem {
  return {
    id: branch.id,
    slug: branch.slug,
    name: branch.name,
    englishName: branch.summary.trim() || branch.name,
    badge: branch.isFeatured ? "BEST" : "NEW",
    isOperating: branch.isFeatured,
    themeColor: "#9e7646",
    address: branch.address,
    addressEn: branch.addressEn,
    checkInTime: branch.checkInTime,
    checkOutTime: branch.checkOutTime,
    tags: branch.categoryTags.filter(Boolean),
    imageSrc: resolveImageSrc(branch),
    imageSources: resolveImageSources(branch),
    href: resolveHref(branch),
    coordinates: resolveCoordinates(branch),
    reservationHref: branch.bookingUrl || "#",
    description: branch.description || branch.summary,
    descriptionEn: branch.descriptionEn,
    features: branch.amenityNotes.filter(Boolean),
    featuresEn: branch.amenityNotesEn.filter(Boolean),
  };
}
