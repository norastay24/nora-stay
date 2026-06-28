import { randomUUID } from "node:crypto";
import type {
  AdminHotelBranch,
  AdminHotelImage,
  HotelCategoryTag,
  HotelColorTheme,
} from "@/app/admin/_components/hotels/admin-hotels-shared";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";

function createSeedImages(prefix: string): AdminHotelImage[] {
  return [
    {
      id: randomUUID(),
      url: `${prefix}/garden-01.jpg`,
      caption: "Garden view",
    },
    {
      id: randomUUID(),
      url: `${prefix}/dining-01.jpg`,
      caption: "Dining area",
    },
    {
      id: randomUUID(),
      url: `${prefix}/bedroom-01.jpg`,
      caption: "Bedroom",
    },
  ];
}

export const fallbackHotelBranches: AdminHotelBranch[] = [
  {
    id: randomUUID(),
    slug: "garosugil",
    name: "노라 스테이 가로수길",
    summary: "NORA STAY Garosugil",
    previewLink: "/locations/garosugil",
    address: "서울 강남구 논현로155길 40, 1F",
    addressEn: "40, Nonhyeon-ro 155-gil, Gangnam-gu, Seoul, 1F",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    colorThemes: ["Nora Brown", "Amber Gold", "Emerald Green"],
    categoryTags: ["다이닝", "프라이빗독채", "정원테라스"],
    description: "도심 속 정원과 라운지, 다이닝이 이어지는 프라이빗 독채 스테이입니다.",
    descriptionEn:
      "A private house stay where garden, lounge, and dining experiences flow together in the city.",
    bookingUrl: "https://www.airbnb.co.kr/rooms/garosugil-nora-stay",
    regionLabel: "서울",
    floorLabel: "1",
    isVisible: true,
    isFeatured: true,
    featureBadges: ["대표", "신규"],
    images: createSeedImages("/images/section-images/experience/sample"),
    amenityNotes: [
      "Wi-Fi, 스마트 TV, 빔프로젝터, 블루투스 스피커",
      "프리미엄 침구와 다이닝 세팅",
    ],
    amenityNotesEn: [
      "Wi-Fi, smart TV, beam projector, bluetooth speaker",
      "Premium bedding and dining setup",
    ],
    naverMapNote: "네이버 지도에서 지점명을 검색해 주세요.",
    sortOrder: 1,
  },
  {
    id: randomUUID(),
    slug: "sejong",
    name: "노라 스테이 세종",
    summary: "NORA STAY Sejong",
    previewLink: "/locations/sejong",
    address: "세종시 나성북로 30, 14F",
    addressEn: "30, Naseongbuk-ro, Sejong-si, 14F",
    checkInTime: "16:00",
    checkOutTime: "12:00",
    colorThemes: ["Nora Brown", "Navy Blue"],
    categoryTags: ["스파사우나", "컨셉호텔"],
    description: "사우나와 시티뷰를 중심으로 회복의 시간을 제안하는 어반 스테이입니다.",
    descriptionEn:
      "An urban stay centered on sauna and city views, designed for slower recovery.",
    bookingUrl: "https://www.airbnb.co.kr/rooms/sejong-nora-stay",
    regionLabel: "충청",
    floorLabel: "14",
    isVisible: true,
    isFeatured: false,
    featureBadges: ["대표", "추천"],
    images: createSeedImages("/images/section-images/experience/sample"),
    amenityNotes: [
      "사우나, 욕실 어메니티, 헤어드라이어",
      "넷플릭스 지원 스마트 TV와 워크데스크",
    ],
    amenityNotesEn: [
      "Sauna, bath amenities, hair dryer",
      "Netflix-ready smart TV and work desk",
    ],
    naverMapNote: "건물 주차장을 이용한 뒤 14층으로 이동해 주세요.",
    sortOrder: 2,
  },
];

function transformBranchRecord(record: Record<string, unknown>): AdminHotelBranch {
  return {
    id: String(record.id),
    slug: String(record.slug ?? ""),
    name: String(record.name ?? ""),
    summary: String(record.summary ?? ""),
    previewLink: String(record.preview_link ?? ""),
    address: String(record.address ?? ""),
    addressEn: String(record.address_en ?? ""),
    latitude: typeof record.latitude === "number" ? record.latitude : undefined,
    longitude: typeof record.longitude === "number" ? record.longitude : undefined,
    checkInTime: String(record.check_in_time ?? ""),
    checkOutTime: String(record.check_out_time ?? ""),
    colorThemes: Array.isArray(record.color_themes)
      ? (record.color_themes as HotelColorTheme[])
      : [],
    categoryTags: Array.isArray(record.category_tags)
      ? (record.category_tags as HotelCategoryTag[])
      : [],
    description: String(record.description ?? ""),
    descriptionEn: String(record.description_en ?? ""),
    bookingUrl: String(record.booking_url ?? ""),
    regionLabel: String(record.region_label ?? ""),
    floorLabel: String(record.floor_label ?? ""),
    isVisible: Boolean(record.is_visible),
    isFeatured: Boolean(record.is_featured),
    featureBadges: Array.isArray(record.feature_badges)
      ? (record.feature_badges as string[])
      : [],
    images: Array.isArray(record.images) ? (record.images as AdminHotelImage[]) : [],
    amenityNotes: Array.isArray(record.amenity_notes) ? (record.amenity_notes as string[]) : [],
    amenityNotesEn: Array.isArray(record.amenity_notes_en)
      ? (record.amenity_notes_en as string[])
      : [],
    naverMapNote: String(record.naver_map_note ?? ""),
    sortOrder: Number(record.sort_order ?? 0),
    createdAt: typeof record.created_at === "string" ? record.created_at : undefined,
    updatedAt: typeof record.updated_at === "string" ? record.updated_at : undefined,
  };
}

export function serializeHotelBranch(branch: AdminHotelBranch) {
  return {
    id: branch.id,
    slug: branch.slug,
    name: branch.name,
    summary: branch.summary,
    preview_link: branch.previewLink,
    address: branch.address,
    address_en: branch.addressEn,
    latitude: branch.latitude ?? null,
    longitude: branch.longitude ?? null,
    check_in_time: branch.checkInTime,
    check_out_time: branch.checkOutTime,
    color_themes: branch.colorThemes,
    category_tags: branch.categoryTags,
    description: branch.description,
    description_en: branch.descriptionEn,
    booking_url: branch.bookingUrl,
    region_label: branch.regionLabel,
    floor_label: branch.floorLabel,
    is_visible: branch.isVisible,
    is_featured: branch.isFeatured,
    feature_badges: branch.featureBadges,
    images: branch.images,
    amenity_notes: branch.amenityNotes,
    amenity_notes_en: branch.amenityNotesEn,
    naver_map_note: branch.naverMapNote,
    sort_order: branch.sortOrder,
  };
}

export async function fetchAdminHotelBranches() {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    return [];
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/admin_hotel_branches?select=*&order=sort_order.asc,created_at.asc`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return [];
  }

  const records = (await response.json()) as Array<Record<string, unknown>>;

  return records.map(transformBranchRecord);
}
