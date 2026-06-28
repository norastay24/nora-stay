export type InstagramSlideImage = {
  id: string;
  url: string;
  label: string;
};

export type InstagramDraft = {
  campaignId: string;
  buddyLinkKo: string;
  buddyLinkEn: string;
  footerKo: string;
  footerEn: string;
  images: InstagramSlideImage[];
};

export function createDefaultInstagramDraft(): InstagramDraft {
  return {
    campaignId: "@norastay_official",
    buddyLinkKo: "https://pf.kakao.com/_NORA_STAY",
    buddyLinkEn: "https://www.instagram.com/norastay_official",
    footerKo: "See more moments @norastay_official",
    footerEn: "See more moments @norastay_official",
    images: [],
  };
}
