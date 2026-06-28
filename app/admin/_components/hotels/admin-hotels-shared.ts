export type HotelColorTheme =
  | "Nora Brown"
  | "Amber Gold"
  | "Emerald Green"
  | "Navy Blue"
  | "Charcoal Gray"
  | "Crimson Red";

export type HotelCategoryTag =
  | "컨셉호텔"
  | "스파사우나"
  | "엔터테인먼트"
  | "다이닝"
  | "프라이빗독채"
  | "정원테라스"
  | "웰니스";

export interface AdminHotelImage {
  id: string;
  url: string;
  caption: string;
}

export interface AdminHotelBranch {
  id: string;
  slug: string;
  name: string;
  summary: string;
  previewLink: string;
  address: string;
  addressEn: string;
  latitude?: number;
  longitude?: number;
  checkInTime: string;
  checkOutTime: string;
  colorThemes: HotelColorTheme[];
  categoryTags: HotelCategoryTag[];
  description: string;
  descriptionEn: string;
  bookingUrl: string;
  regionLabel: string;
  floorLabel: string;
  isVisible: boolean;
  isFeatured: boolean;
  featureBadges: string[];
  images: AdminHotelImage[];
  amenityNotes: string[];
  amenityNotesEn: string[];
  naverMapNote: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export const hotelColorThemes: HotelColorTheme[] = [
  "Nora Brown",
  "Amber Gold",
  "Emerald Green",
  "Navy Blue",
  "Charcoal Gray",
  "Crimson Red",
];

export const hotelThemeColorMap: Record<HotelColorTheme, string> = {
  "Nora Brown": "#9b7a4a",
  "Amber Gold": "#d97c00",
  "Emerald Green": "#0f9f6e",
  "Navy Blue": "#3157d5",
  "Charcoal Gray": "#374151",
  "Crimson Red": "#e12a2a",
};

export const hotelCategoryTags: HotelCategoryTag[] = [
  "컨셉호텔",
  "스파사우나",
  "엔터테인먼트",
  "다이닝",
  "프라이빗독채",
  "정원테라스",
  "웰니스",
];

export const koreaRegionOptions = [
  "서울",
  "경기",
  "대전",
  "충청",
  "인천",
  "경상",
  "전라",
  "강원",
  "부산",
] as const;

export function createClientId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createEmptyHotelBranch(sortOrder: number): AdminHotelBranch {
  const id = createClientId();

  return {
    id,
    slug: "",
    name: "",
    summary: "",
    previewLink: "",
    address: "",
    addressEn: "",
    checkInTime: "",
    checkOutTime: "",
    colorThemes: ["Nora Brown"],
    categoryTags: [],
    description: "",
    descriptionEn: "",
    bookingUrl: "",
    regionLabel: "",
    floorLabel: "",
    isVisible: false,
    isFeatured: false,
    featureBadges: [],
    images: [],
    amenityNotes: [],
    amenityNotesEn: [],
    naverMapNote: "",
    sortOrder,
  };
}
