export type AdminExperiencePageSettings = {
  mainTitleKo: string;
  mainTitleEn: string;
  descriptionKo: string;
  descriptionEn: string;
};

export type AdminExperienceItem = {
  id: string;
  categoryId: string;
  titleKo: string;
  titleEn: string;
  descriptionKo: string;
  descriptionEn: string;
  imageUrl: string;
  isVisible: boolean;
  sortOrder: number;
};

export type AdminExperienceCategory = {
  id: string;
  slug: string;
  titleKo: string;
  titleEn: string;
  subtitleKo: string;
  subtitleEn: string;
  descriptionKo: string;
  descriptionEn: string;
  isVisible: boolean;
  sortOrder: number;
};

export type AdminExperienceContent = {
  settings: AdminExperiencePageSettings;
  categories: AdminExperienceCategory[];
  items: AdminExperienceItem[];
};

export const DEFAULT_EXPERIENCE_SETTINGS: AdminExperiencePageSettings = {
  mainTitleKo: "잠만 자는 공간 말고,\n함께 머무는 경험",
  mainTitleEn: "Not just a space to sleep, but an experience of staying together",
  descriptionKo:
    "일상의 소음에서 벗어나, 좋은 사람들과 온전히 머물 수 있는 공간. 가장 잘 맞는 NORA STAY를 직접 경험해보세요.",
  descriptionEn:
    "A space where you can escape the noise of daily life and fully stay with good people. Experience the NORA STAY that suits you best.",
};

export const DEFAULT_EXPERIENCE_CATEGORIES: AdminExperienceCategory[] = [
  {
    id: "concept-hotel",
    slug: "concept-hotel",
    titleKo: "컨셉호텔",
    titleEn: "Concept Hotel",
    subtitleKo: "같은 아늑 호텔은 없어요",
    subtitleEn: "No two Anook hotels are the same",
    descriptionKo: "공간마다 다른 컨셉으로 취향에 맞는 아늑함을 고를 수 있어요",
    descriptionEn: "Choose your comfort with different concepts for each space",
    isVisible: true,
    sortOrder: 1,
  },
  {
    id: "spa-sauna",
    slug: "spa-sauna",
    titleKo: "스파&사우나",
    titleEn: "Spa & Sauna",
    subtitleKo: "쉼과 회복이 함께 있는 스테이",
    subtitleEn: "A stay designed for rest and recovery",
    descriptionKo: "온전한 휴식과 회복을 위한 스파 컨셉 스테이를 경험해보세요",
    descriptionEn: "Experience a spa-focused stay designed for complete rest and recovery",
    isVisible: true,
    sortOrder: 2,
  },
  {
    id: "signature",
    slug: "signature",
    titleKo: "시그니처",
    titleEn: "Signature",
    subtitleKo: "감각적인 프리미엄 무드",
    subtitleEn: "A premium mood with refined detail",
    descriptionKo: "머무는 순간이 특별해지는 시그니처 공간을 소개합니다",
    descriptionEn: "Discover signature spaces where every stay feels distinct",
    isVisible: true,
    sortOrder: 3,
  },
  {
    id: "dado",
    slug: "dado",
    titleKo: "다도",
    titleEn: "Tea Ritual",
    subtitleKo: "차분한 감도의 쉼",
    subtitleEn: "A calm retreat shaped by ritual",
    descriptionKo: "차 한 잔과 함께 천천히 머무는 시간을 위한 테마 공간입니다",
    descriptionEn: "A themed stay for slowing down with a quiet tea ritual",
    isVisible: true,
    sortOrder: 4,
  },
  {
    id: "music",
    slug: "music",
    titleKo: "뮤직",
    titleEn: "Music",
    subtitleKo: "좋아하는 사운드로 채우는 순간",
    subtitleEn: "Moments filled with the sound you love",
    descriptionKo: "머무는 동안 취향의 음악에 깊게 몰입할 수 있는 공간이에요",
    descriptionEn: "A stay where you can fully immerse yourself in the sound you love",
    isVisible: true,
    sortOrder: 5,
  },
  {
    id: "business",
    slug: "business",
    titleKo: "비즈니스",
    titleEn: "Business",
    subtitleKo: "일과 쉼이 자연스럽게 이어지는 공간",
    subtitleEn: "A stay where work and rest connect naturally",
    descriptionKo: "업무와 휴식을 함께 담아낼 수 있는 실용적인 스테이를 준비했어요",
    descriptionEn: "A practical stay designed to support both focus and rest",
    isVisible: true,
    sortOrder: 6,
  },
];

export const DEFAULT_EXPERIENCE_ITEMS: AdminExperienceItem[] = [
  {
    id: "concept-hotel-item",
    categoryId: "concept-hotel",
    titleKo: "아늑 호텔",
    titleEn: "Anook Hotel",
    descriptionKo: "다양한 테마룸으로 채운 아늑 오리지널",
    descriptionEn: "Anook Original filled with various themed rooms",
    imageUrl: "/images/section-images/experience/sofa.jpg",
    isVisible: true,
    sortOrder: 1,
  },
  {
    id: "spa-sauna-item",
    categoryId: "spa-sauna",
    titleKo: "아늑 호텔 & 스파",
    titleEn: "Anook Hotel & Spa",
    descriptionKo: "온전한 휴식과 회복을 위한 스파 테마 스테이",
    descriptionEn: "A spa-themed stay for complete rest and recovery",
    imageUrl: "/images/section-images/experience/ss.png",
    isVisible: true,
    sortOrder: 1,
  },
  {
    id: "signature-item",
    categoryId: "signature",
    titleKo: "아늑 시그니처",
    titleEn: "Anook Signature",
    descriptionKo: "아늑의 감성을 담은 프리미엄 시그니처 공간",
    descriptionEn: "A premium signature stay carrying the mood of Anook",
    imageUrl: "/images/section-images/experience/s1.png",
    isVisible: true,
    sortOrder: 1,
  },
  {
    id: "dado-item",
    categoryId: "dado",
    titleKo: "다도 스테이",
    titleEn: "Tea Ritual Stay",
    descriptionKo: "차분한 무드와 감각적인 디테일이 공존하는 공간",
    descriptionEn: "A stay where calm mood and thoughtful detail coexist",
    imageUrl: "/images/section-images/experience/다도.png",
    isVisible: true,
    sortOrder: 1,
  },
  {
    id: "music-item",
    categoryId: "music",
    titleKo: "뮤직 스테이",
    titleEn: "Music Stay",
    descriptionKo: "좋아하는 사운드와 함께 머무는 몰입형 객실",
    descriptionEn: "An immersive stay designed around the sound you love",
    imageUrl: "/images/section-images/experience/뮤직.png",
    isVisible: true,
    sortOrder: 1,
  },
  {
    id: "business-item",
    categoryId: "business",
    titleKo: "비즈니스 스테이",
    titleEn: "Business Stay",
    descriptionKo: "업무와 휴식을 자연스럽게 이어주는 다목적 공간",
    descriptionEn: "A multipurpose stay connecting work and rest naturally",
    imageUrl: "/images/section-images/experience/회의.png",
    isVisible: true,
    sortOrder: 1,
  },
];

export function createDefaultExperienceContent(): AdminExperienceContent {
  return {
    settings: { ...DEFAULT_EXPERIENCE_SETTINGS },
    categories: DEFAULT_EXPERIENCE_CATEGORIES.map((category) => ({ ...category })),
    items: DEFAULT_EXPERIENCE_ITEMS.map((item) => ({ ...item })),
  };
}
