export const LOCALE_COOKIE_NAME = "nora-locale";

export const APP_LOCALES = ["ko", "en"] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

export function normalizeLocale(value?: string | null): AppLocale {
  return APP_LOCALES.includes(value as AppLocale) ? (value as AppLocale) : "ko";
}

export function getStaticMessageLocale(locale: AppLocale) {
  return locale === "ko" ? "ko" : "en";
}

export function getLocalizedValue(locale: AppLocale, ko: string, en?: string) {
  if (locale === "en" && typeof en === "string" && en.trim().length > 0) {
    return en;
  }

  return ko;
}

export const commonMessages = {
  header: {
    ko: {
      brandStory: "브랜드소개",
      experience: "경험",
      locations: "지점안내",
      findStays: "숙소 찾기",
      ready: "준비중",
      language: "언어 선택",
    },
    en: {
      brandStory: "Brand Story",
      experience: "Experience",
      locations: "Locations",
      findStays: "Find Stays",
      ready: "Coming Soon",
      language: "Select language",
    },
  },
  footer: {
    ko: {
      tagline:
        "일상과 경계를 벗어난, 조용한 휴식의 시작. 이제부터 NORA STAY에서 만나보세요.",
      findStays: "숙소 찾기",
      language: "언어 선택",
      address: "NORA 본점 : 서울특별시 강남구 논현로 5길 40, 1층",
      inquiry: "제휴 및 촬영 문의 : norastay24@gmail.com",
      admin: "파트너센터 (관리자)",
      copyright: "© 2026 NORA STAY. All rights reserved.",
    },
    en: {
      tagline:
        "Step beyond the everyday and begin a quiet escape. Discover your stay with NORA STAY.",
      findStays: "Find Stays",
      language: "Select language",
      address: "NORA HQ : 40, Nonhyeon-ro 5-gil, Gangnam-gu, Seoul, 1F",
      inquiry: "Partnership & shoot inquiries : norastay24@gmail.com",
      admin: "Partner Center (Admin)",
      copyright: "© 2026 NORA STAY. All rights reserved.",
    },
  },
  preparingModal: {
    ko: {
      titleSuffix: "오픈 준비중",
      subtitleSuffix: "은 현재 오픈 준비중입니다.",
      infoLabel: "안내 말씀",
      bodyPrefix: "NORA STAY가 새로운 여정, ",
      bodySuffix:
        "이(가) 찾아옵니다. 완벽한 휴식을 위해 세심하게 준비 중이오니 많은 기대 부탁드립니다.",
      confirm: "확인",
    },
    en: {
      titleSuffix: "Opening Soon",
      subtitleSuffix: "is currently preparing to open.",
      infoLabel: "Announcement",
      bodyPrefix: "NORA STAY is preparing a new journey at ",
      bodySuffix: ". We are meticulously preparing to provide you with the perfect rest. We look forward to welcoming you soon.",
      confirm: "Close",
    },
  },
  popup: {
    ko: {
      grandOpen: "GRAND OPEN",
      noImage: "이미지가 없습니다.",
      dismissToday: "하루 동안 보지 않기",
      close: "닫기",
      imageAlt: "팝업 이미지",
    },
    en: {
      grandOpen: "GRAND OPEN",
      noImage: "No image available.",
      dismissToday: "Hide for today",
      close: "Close",
      imageAlt: "Popup image",
    },
  },
  home: {
    ko: {
      hero: {
        eyebrow: "도시 속, 온전히 나에게 집중하는 시간",
        title: ["Your Quiet", "Escape in the City"],
        meta: "NORA STAY · GAROSU-GIL · SEOUL",
        primaryChip: "SEOUL · 서울 1호점",
        secondaryChip: "강남 가로수길",
        ctaLabel: "에어비앤비 숙소 예약하기",
      },
      about: {
        eyebrow: "ABOUT NORA",
        title: "도심 한가운데,\n우리만의 프라이빗 스테이",
        description:
          "신사동 가로수길 한가운데에서 만나는 프라이빗 감성 스테이의 경험을 만나보세요.",
        ctaLabel: "지점안내 - NORA STAY 지점들 둘러보기",
      },
      experienceBanner: {
        title: "도시를 머무는 공간을 넘어,\n쉼만의 시간을 위한 스테이",
        description:
          "온전한 프라이빗한 공간에서\n휴식과 영감을 채우는 시간을 경험해보세요.",
        ctaLabel: "숙소위치 지도로 둘러보기",
      },
      stayExperience: {
        sectionTitle: "나에게 맞는 공간과 경험을 선택하세요",
        roomsTitle: "나에게 꼭 맞는 공간을 선택하세요",
        roomsDescription: "NORA STAY만의 입체적인 객실 타입을 확인해보세요.",
        roomsCta: "객실 둘러보기",
        experienceTitle: "NORA STAY에서 완성되는 품격의 경험",
        experienceDescription: "온전한 휴식과 치유를 위한 스파 특화 브랜드.",
        experienceCta: "경험 둘러보기",
      },
      ctaBanner: {
        title: "일상에서 벗어나\n나를 위한 시간을 가져보세요.",
        description: "NORA STAY가 당신의 하루를 특별하게 만들어드립니다.",
        ctaLabel: "에어비앤비 숙소 예약하기",
      },
      locations: {
        sectionTitle: "주요권역 전역으로 확장 중",
        sectionDescription:
          "NORA STAY는 브랜드 관리자에서 실시간으로 지점을 등록하고 노출할 수 있는 동적 시스템으로 구성되었습니다.",
        branchSuffix: "지점",
        operating: "영업중",
        ready: "준비중",
        detail: "객실 구경하기",
        reserve: "예약하기",
        footer: "다른 지점도 순차적으로 오픈 예정입니다.",
      },
      features: [
        {
          number: "01",
          icon: "🏫",
          title: "프라이빗 공간",
          description: "휴식, 거주, 취사까지 모두 가능한 프라이빗 독채 공간입니다.",
        },
        {
          number: "02",
          icon: "📍",
          title: "가로수길 핵심권",
          description: "서울 강남 신사동 가로수길에 위치한 감성적인 부티크 스테이의 환경.",
        },
        {
          number: "03",
          icon: "🛁",
          title: "프리미엄 어메니티",
          description: "세심하게 준비한 호텔급 이상의 프리미엄 어메니티로 최고의 경험을 제공합니다.",
        },
        {
          number: "04",
          icon: "💼",
          title: "기업 모임형 공간",
          description: "워크숍, 비즈 프로젝트, 촬영 공간으로 브랜딩과 미팅에 적합합니다.",
        },
        {
          number: "05",
          icon: "🛏",
          title: "10개의 독립 객실",
          description: "총 10개의 객실 구성으로 단체 숙박과 모임이 가능합니다.",
        },
        {
          number: "06",
          icon: "🏠",
          title: "프라이빗 독채주택",
          description: "신사 가로수길 중심에서 감성적인 휴식의 경험을 만나보세요.",
        },
      ],
    },
    en: {
      hero: {
        eyebrow: "A stay crafted for complete rest in the city",
        title: ["Your Quiet", "Escape in the City"],
        meta: "NORA STAY · GAROSU-GIL · SEOUL",
        primaryChip: "SEOUL · Flagship No.1",
        secondaryChip: "Gangnam Garosugil",
        ctaLabel: "Book on Airbnb",
      },
      about: {
        eyebrow: "ABOUT NORA",
        title: "A private stay,\nat the heart of your daily pause",
        description: "Discover a private, design-led stay experience in the heart of Garosugil.",
        ctaLabel: "Locations - Explore NORA STAY destinations",
      },
      experienceBanner: {
        title: "More than a place to stay,\na space for your own quiet time",
        description:
          "Experience moments of rest and inspiration\ninside a fully private atmosphere.",
        ctaLabel: "Explore stay locations on the map",
      },
      stayExperience: {
        sectionTitle: "Choose the stay and experience that fit your pace",
        roomsTitle: "Choose a room that fits your stay",
        roomsDescription: "Explore NORA STAY's distinctive room selections.",
        roomsCta: "Explore Rooms",
        experienceTitle: "Refined experiences completed by NORA STAY",
        experienceDescription: "A spa-focused brand designed for deep rest and healing.",
        experienceCta: "Explore Experiences",
      },
      ctaBanner: {
        title: "Step away from the everyday\nand make time to rest.",
        description: "NORA STAY turns an ordinary day into something special.",
        ctaLabel: "Book on Airbnb",
      },
      locations: {
        sectionTitle: "Expanding across key city destinations",
        sectionDescription:
          "NORA STAY is built as a dynamic system where branches can be added and published in real time from the brand admin.",
        branchSuffix: "Branch",
        operating: "Open Now",
        ready: "Coming Soon",
        detail: "View Rooms",
        reserve: "Book Now",
        footer: "More branches will open sequentially.",
      },
      features: [
        {
          number: "01",
          icon: "🏫",
          title: "Private Space",
          description: "A fully private stay where you can rest, live, and cook with ease.",
        },
        {
          number: "02",
          icon: "📍",
          title: "Garosugil Urban Hub",
          description: "A boutique stay located in one of Gangnam's most vibrant districts.",
        },
        {
          number: "03",
          icon: "🛁",
          title: "Premium Amenities",
          description:
            "Carefully prepared amenities deliver a stay beyond standard hotel comfort.",
        },
        {
          number: "04",
          icon: "💼",
          title: "Business-Friendly Space",
          description:
            "Suitable for workshops, filming, and intimate brand or team gatherings.",
        },
        {
          number: "05",
          icon: "🛏",
          title: "10 Independent Rooms",
          description: "Ten separate rooms make group stays and private gatherings possible.",
        },
        {
          number: "06",
          icon: "🏠",
          title: "Private House Stay",
          description: "Enjoy a design-focused retreat in the center of Garosugil.",
        },
      ],
    },
  },
  branches: {
    ko: {
      title: "지점 안내",
      totalPrefix: "총",
      totalSuffix: "개 지점",
      searchPlaceholder: "원하시는 NORA STAY를 찾아보세요",
      branchList: "지점 리스트",
      noResultsTitle: "조건에 맞는 지점이 없습니다",
      noResultsDescription: "검색어를 지우거나 필터를 다시 선택해보세요.",
      close: "팝업 닫기",
      prevImage: "이전 이미지",
      nextImage: "다음 이미지",
      naverMap: "네이버 지도 길찾기",
      basicInfo: "기본 정보",
      hotelFeatures: "호텔의 특징",
      viewRooms: "객실 구경하기",
      goReserve: "예약하러 가기",
      currentLocation: "현재 위치로 이동",
      zoomIn: "지도 확대",
      zoomOut: "지도 축소",
      sortOptions: ["인기순", "최신순"],
    },
    en: {
      title: "Locations",
      totalPrefix: "Total",
      totalSuffix: " branches",
      searchPlaceholder: "Search for a NORA STAY location",
      branchList: "Branch List",
      noResultsTitle: "No branches match your filters",
      noResultsDescription: "Clear the search or adjust the filters and try again.",
      close: "Close popup",
      prevImage: "Previous image",
      nextImage: "Next image",
      naverMap: "Open in Naver Map",
      basicInfo: "Overview",
      hotelFeatures: "Highlights",
      viewRooms: "View Rooms",
      goReserve: "Book Now",
      currentLocation: "Go to current location",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      sortOptions: ["Popular", "Newest"],
    },
  },
  experience: {
    ko: {
      all: "전체 경험",
      ctaTitle: "일상과 경계를 벗어나\n머무름의 가치를 경험하세요",
      ctaDescription:
        "또 다른 영감과 머무름의 공간.\nNORA STAY가 준비한 프라이빗 스테이를 경험해보세요.",
      ctaButton: "지금 숙소찾기",
    },
    en: {
      all: "All Experiences",
      ctaTitle: "Step beyond the ordinary\nand discover the value of staying",
      ctaDescription:
        "Another space for inspiration and pause.\nExperience the private stay prepared by NORA STAY.",
      ctaButton: "Find a Stay Now",
    },
  },
} as const;
