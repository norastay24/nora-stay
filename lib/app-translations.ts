import type { AppLocale } from "@/lib/i18n";
import type { AdminTranslationEntry } from "@/app/admin/_components/translations/admin-translations-shared";

type SeedEntry = {
  key: string;
  ko: string;
  en: string;
  ja?: string;
  zh?: string;
};

export const APP_TRANSLATION_SEED: SeedEntry[] = [
  { key: "header_brand_story", ko: "브랜드 소개", en: "Brand Story", ja: "ブランド紹介", zh: "品牌介绍" },
  { key: "header_experience", ko: "경험", en: "Experience", ja: "体験", zh: "体验" },
  { key: "header_locations", ko: "지점 안내", en: "Locations", ja: "拠点案内", zh: "门店介绍" },
  { key: "header_find_stays", ko: "숙소 찾기", en: "Find Stays", ja: "宿を探す", zh: "查找住宿" },
  { key: "header_ready", ko: "준비중", en: "Coming Soon", ja: "準備中", zh: "准备中" },
  { key: "header_language", ko: "언어 선택", en: "Select language", ja: "言語選択", zh: "选择语言" },
  { key: "footer_tagline", ko: "일상과 경계를 벗어나 조용한 휴식의 시작. 이제부터 NORA STAY에서 만나보세요.", en: "Step beyond the everyday and begin a quiet escape. Discover your stay with NORA STAY.", ja: "日常の境界を離れ、静かな休息の始まりをNORA STAYで。", zh: "逃离日常边界，在 NORA STAY 开启安静休憩。" },
  { key: "footer_find_stays", ko: "숙소 찾기", en: "Find Stays", ja: "宿を探す", zh: "查找住宿" },
  { key: "footer_language", ko: "언어 선택", en: "Select language", ja: "言語選択", zh: "选择语言" },
  { key: "footer_address", ko: "NORA 본점 : 서울특별시 강남구 논현로5길 40, 1층", en: "NORA HQ : 40, Nonhyeon-ro 5-gil, Gangnam-gu, Seoul, 1F", ja: "NORA 本店 : ソウル特別市 江南区 論峴路5キル 40, 1階", zh: "NORA 总店：首尔特别市江南区论岘路5街40，1层" },
  { key: "footer_inquiry", ko: "제휴 및 촬영 문의 : norastay24@gmail.com", en: "Partnership & shoot inquiries : norastay24@gmail.com", ja: "提携・撮影のお問い合わせ : norastay24@gmail.com", zh: "合作与拍摄咨询：norastay24@gmail.com" },
  { key: "footer_company01", ko: "(주) 어반노마드 | 대표 문성오 | 사업자등록번호 : 886-81-02339", en: "Urban Nomad Co., Ltd. | CEO Sung O Moon | Business Registration No. : 886-81-02339" },
  { key: "footer_company02", ko: "(주) 두고홀딩스 | 대표 문원오 | 사업자등록번호 : 363-87-01411", en: "Dugo Holdings Co., Ltd. | CEO Won O Moon | Business Registration No. : 363-87-01411" },
  { key: "footer_admin", ko: "파트너 센터 (관리자)", en: "Partner Center (Admin)", ja: "パートナーセンター (管理者)", zh: "合作伙伴中心（管理员）" },
  { key: "footer_copyright", ko: "© 2026 NORA STAY. All rights reserved.", en: "© 2026 NORA STAY. All rights reserved.", ja: "© 2026 NORA STAY. All rights reserved.", zh: "© 2026 NORA STAY. 版权所有。" },
  { key: "popup_grand_open", ko: "GRAND OPEN", en: "GRAND OPEN", ja: "GRAND OPEN", zh: "GRAND OPEN" },
  { key: "popup_no_image", ko: "이미지가 없습니다.", en: "No image available.", ja: "画像がありません。", zh: "没有可用图片。" },
  { key: "popup_dismiss_today", ko: "하루 동안 보지 않기", en: "Hide for today", ja: "今日は表示しない", zh: "今日不再显示" },
  { key: "popup_close", ko: "닫기", en: "Close", ja: "閉じる", zh: "关闭" },
  { key: "popup_image_alt", ko: "팝업 이미지", en: "Popup image", ja: "ポップアップ画像", zh: "弹窗图片" },
  { key: "home_hero_primary_chip", ko: "SEOUL · 서울 1호점", en: "SEOUL · Flagship No.1", ja: "SEOUL · ソウル1号店", zh: "SEOUL · 首尔1号店" },
  { key: "home_hero_secondary_chip", ko: "강남 가로수길", en: "Gangnam Garosugil", ja: "江南 カロスキル", zh: "江南 林荫路" },
  { key: "home_hero_eyebrow", ko: "도시 속 완전한 휴식을 위해 지어진 시간", en: "A stay crafted for complete rest in the city", ja: "都市の中で完全な休息のために設計された滞在", zh: "为城市中的彻底休憩而打造的停留" },
  { key: "home_hero_title_line_1", ko: "Your Quiet", en: "Your Quiet", ja: "Your Quiet", zh: "Your Quiet" },
  { key: "home_hero_title_line_2", ko: "Escape in the City", en: "Escape in the City", ja: "Escape in the City", zh: "Escape in the City" },
  { key: "home_hero_meta", ko: "NORA STAY · GAROSU-GIL · SEOUL", en: "NORA STAY · GAROSU-GIL · SEOUL", ja: "NORA STAY · GAROSU-GIL · SEOUL", zh: "NORA STAY · GAROSU-GIL · SEOUL" },
  { key: "reserve_button", ko: "예약하기", en: "Book Now", ja: "予約する", zh: "立即预订" },
  { key: "home_about_eyebrow", ko: "ABOUT NORA", en: "ABOUT NORA", ja: "ABOUT NORA", zh: "ABOUT NORA" },
  { key: "home_about_title", ko: "일상 속 쉼을 담는,\n우리만의 프라이빗 스테이", en: "A private stay,\nat the heart of your daily pause", ja: "日常の休息を込めた、\n私たちだけのプライベートステイ", zh: "装下日常休憩的，\n属于我们的私享住宿" },
  { key: "home_about_description", ko: "도심 속 가로수길 한가운데에서 만나는 프라이빗 감성 스테이의 경험을 만나보세요.", en: "Discover a private, design-led stay experience in the heart of Garosugil.", ja: "カロスキルの中心で出会う、感性あふれるプライベートステイを体験してください。", zh: "在林荫路核心地段，体验兼具私密与设计感的住宿。" },
  { key: "home_about_cta", ko: "지점안내 - NORA STAY 지점들 둘러보기", en: "Locations - Explore NORA STAY destinations", ja: "拠点案内 - NORA STAYの拠点を見る", zh: "门店介绍 - 浏览 NORA STAY 门店" },
  { key: "home_experience_title", ko: "도시를 머무는 공간으로 바꾸어,\n온전한 시간을 위한 스테이", en: "More than a place to stay,\na space for your own quiet time", ja: "都市を滞在する空間へ変え、\n自分だけの時間のためのステイ", zh: "把城市变成停留的空间，\n为完整时光而准备的住宿" },
  { key: "home_experience_description", ko: "완전한 프라이빗한 공간에서\n휴식과 영감을 채우는 시간을 경험해보세요.", en: "Experience moments of rest and inspiration\ninside a fully private atmosphere.", ja: "完全にプライベートな空間で、\n休息とインスピレーションを満たす時間を。", zh: "在完全私密的空间里，\n感受充满休息与灵感的时刻。" },
  { key: "home_experience_cta", ko: "숙소위치 지도로 둘러보기", en: "Explore stay locations on the map", ja: "宿の場所を地図で見る", zh: "在地图上查看住宿位置" },
  { key: "home_stay_experience_section_title", ko: "나에게 맞는 공간과 경험을 선택하세요", en: "Choose the stay and experience that fit your pace", ja: "自分に合う空間と体験を選んでください", zh: "选择适合你的空间与体验" },
  { key: "home_stay_rooms_title", ko: "나에게 꼭 맞는 공간을 선택하세요", en: "Choose a room that fits your stay", ja: "自分に合う客室を選んでください", zh: "选择适合你的房型" },
  { key: "home_stay_rooms_description", ko: "NORA STAY만의 입체적인 객실 타입을 확인해보세요.", en: "Explore NORA STAY's distinctive room selections.", ja: "NORA STAYならではの客室タイプをご覧ください。", zh: "查看 NORA STAY 独有的客房类型。" },
  { key: "home_stay_rooms_cta", ko: "객실 둘러보기", en: "Explore Rooms", ja: "客室を見る", zh: "查看客房" },
  { key: "home_stay_experiences_title", ko: "NORA STAY에서 완성되는 감각적 경험", en: "Refined experiences completed by NORA STAY", ja: "NORA STAYで完成する感覚的な体験", zh: "在 NORA STAY 完成的感官体验" },
  { key: "home_stay_experiences_description", ko: "완전한 휴식과 치유를 위한 스파 특화 브랜드", en: "A spa-focused brand designed for deep rest and healing.", ja: "深い休息と癒やしのためのスパ特化ブランド", zh: "为深度休憩与疗愈打造的水疗特色品牌" },
  { key: "home_stay_experiences_cta", ko: "경험 둘러보기", en: "Explore Experiences", ja: "体験を見る", zh: "查看体验" },
  { key: "home_cta_title", ko: "일상에서 벗어나\n쉼을 위한 시간을 가져보세요.", en: "Step away from the everyday\nand make time to rest.", ja: "日常を離れて\n休息のための時間を過ごしてください。", zh: "暂别日常，\n为休息留出一点时间。" },
  { key: "home_cta_description", ko: "NORA STAY가 당신의 하루를 특별하게 만들어드립니다.", en: "NORA STAY turns an ordinary day into something special.", ja: "NORA STAYがあなたの一日を特別にします。", zh: "NORA STAY 让你的一天变得特别。" },
  { key: "home_locations_section_title", ko: "주요권역 전역으로 확장 중", en: "Expanding across key city destinations", ja: "主要エリア全体へ拡大中", zh: "正扩展至核心城市区域" },
  { key: "home_locations_section_description", ko: "NORA STAY는 브랜드 관리자에서 실시간으로 지점을 등록하고 노출할 수 있는 동적 시스템으로 구성되어 있습니다.", en: "NORA STAY is built as a dynamic system where branches can be added and published in real time from the brand admin.", ja: "NORA STAYは、ブランド管理画面から拠点をリアルタイムで登録・公開できる動的システムです。", zh: "NORA STAY 构建了一个可在品牌管理后台实时新增并发布门店的动态系统。" },
  { key: "home_locations_branch_suffix", ko: "지점", en: "Branch", ja: "店舗", zh: "门店" },
  { key: "home_locations_operating", ko: "운영중", en: "Open Now", ja: "営業中", zh: "营业中" },
  { key: "home_locations_ready", ko: "준비중", en: "Coming Soon", ja: "準備中", zh: "准备中" },
  { key: "home_locations_detail", ko: "객실 구경하기", en: "View Rooms", ja: "客室を見る", zh: "查看客房" },
  { key: "home_locations_footer", ko: "다른 지점도 순차적으로 오픈 예정입니다.", en: "More branches will open sequentially.", ja: "他の拠点も順次オープン予定です。", zh: "更多门店将陆续开放。" },
  { key: "home_features_01_title", ko: "프라이빗 공간", en: "Private Space", ja: "プライベート空間", zh: "私享空间" },
  { key: "home_features_01_description", ko: "휴식, 거주, 취사까지 모두 가능한 프라이빗 하우스형 공간입니다.", en: "A fully private stay where you can rest, live, and cook with ease.", ja: "休息、滞在、自炊まですべて可能なプライベートハウス型空間です。", zh: "可休息、居住、烹饪的私享住宅式空间。" },
  { key: "home_features_02_title", ko: "가로수길 중심권", en: "Garosugil Urban Hub", ja: "カロスキル中心圏", zh: "林荫路核心地段" },
  { key: "home_features_02_description", ko: "서울 강남 핵심 상권 가로수길에 위치한 감성적인 부티크 스테이의 환경.", en: "A boutique stay located in one of Gangnam's most vibrant districts.", ja: "江南の中心商圏カロスキルに位置する感性豊かなブティックステイ。", zh: "位于江南核心商圈林荫路的精品住宿环境。" },
  { key: "home_features_03_title", ko: "프리미엄 어메니티", en: "Premium Amenities", ja: "プレミアムアメニティ", zh: "高端设施用品" },
  { key: "home_features_03_description", ko: "정성껏 준비한 호텔급 이상의 프리미엄 어메니티로 최고의 경험을 제공합니다.", en: "Carefully prepared amenities deliver a stay beyond standard hotel comfort.", ja: "丁寧に用意したプレミアムアメニティで、ホテル以上の体験を提供します。", zh: "精心准备的高端用品，带来超越酒店标准的体验。" },
  { key: "home_features_04_title", ko: "기업 모임용 공간", en: "Business-Friendly Space", ja: "企業向けミーティング空間", zh: "企业聚会空间" },
  { key: "home_features_04_description", ko: "워크숍, 브랜드 프로젝트, 촬영 공간으로 브랜드와 미팅에 적합합니다.", en: "Suitable for workshops, filming, and intimate brand or team gatherings.", ja: "ワークショップ、撮影、ブランドやチームの集まりに適しています。", zh: "适合工作坊、拍摄以及品牌和团队小型聚会。" },
  { key: "home_features_05_title", ko: "10개의 독립 객실", en: "10 Independent Rooms", ja: "10室の独立客室", zh: "10间独立客房" },
  { key: "home_features_05_description", ko: "총 10개의 객실 구성으로 단체 숙박과 모임도 가능합니다.", en: "Ten separate rooms make group stays and private gatherings possible.", ja: "全10室の構成で、団体宿泊や集まりにも対応します。", zh: "共10间客房，可满足团体入住与聚会需求。" },
  { key: "home_features_06_title", ko: "프라이빗 단독주택", en: "Private House Stay", ja: "プライベート一棟貸し", zh: "私享独栋住宿" },
  { key: "home_features_06_description", ko: "도심 가로수길 중심에서 감성적인 휴식의 경험을 만나보세요.", en: "Enjoy a design-focused retreat in the center of Garosugil.", ja: "都心カロスキルの中心で感性豊かな休息をお楽しみください。", zh: "在林荫路中心感受富有设计感的休息体验。" },
];

export const USED_TRANSLATION_KEYS = APP_TRANSLATION_SEED.map((entry) => entry.key);
export const TRANSLATION_EXPORT_COLUMNS: Array<"key" | "ko" | "en"> = ["key", "ko", "en"];

export function createSeedTranslationEntries(): AdminTranslationEntry[] {
  return APP_TRANSLATION_SEED.map((entry) => ({
    id: `seed-${entry.key}`,
    key: entry.key,
    ko: entry.ko,
    en: entry.en,
  }));
}

export function isSupportedTranslationLocale(value: string): value is AppLocale {
  return value === "ko" || value === "en";
}

export function isTranslationKeyUsed(key: string) {
  const normalizedKey = key.trim();

  if (!normalizedKey) {
    return false;
  }

  if (USED_TRANSLATION_KEYS.includes(normalizedKey)) {
    return true;
  }

  if (/^branch\.[a-z0-9-]+\.(name|address|description|feature\.\d+)$/i.test(normalizedKey)) {
    return true;
  }

  if (/^location\.[a-z0-9-]+\./i.test(normalizedKey)) {
    return true;
  }

  if (/^(branches_|popup_|preparing_modal_|experience_)/i.test(normalizedKey)) {
    return true;
  }

  return false;
}
