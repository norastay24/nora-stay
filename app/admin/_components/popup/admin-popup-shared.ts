export const adminPopupTargetPageOptions = [
  { id: "home", label: "메인홈", path: "/home" },
  { id: "branches", label: "지점안내", path: "/branches" },
  { id: "experience", label: "경험", path: "/experience" },
] as const;

export type AdminPopupTargetPage = (typeof adminPopupTargetPageOptions)[number]["id"];

export type AdminPopupSettings = {
  isVisible: boolean;
  titleKo: string;
  titleEn: string;
  buttonLabelKo: string;
  buttonLabelEn: string;
  descriptionKo: string;
  descriptionEn: string;
  linkUrl: string;
  targetPages: AdminPopupTargetPage[];
  imageUrl: string;
};

export function createDefaultAdminPopupSettings(): AdminPopupSettings {
  return {
    isVisible: false,
    titleKo: "",
    titleEn: "",
    buttonLabelKo: "",
    buttonLabelEn: "",
    descriptionKo: "",
    descriptionEn: "",
    linkUrl: "",
    targetPages: [],
    imageUrl: "",
  };
}
