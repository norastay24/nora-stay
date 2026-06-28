import type { LucideIcon } from "lucide-react";
import {
  Compass,
  Languages,
  MapPinned,
  MessageSquare,
  PenLine,
  Settings,
  SlidersHorizontal,
  User,
} from "lucide-react";

export type AdminNavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  activeMatch?: (pathname: string) => boolean;
};

export const adminNavItems: AdminNavItem[] = [
  {
    id: "main",
    label: "메인 홈 관리",
    icon: SlidersHorizontal,
    href: "/admin",
    activeMatch: (pathname) => pathname === "/admin",
  },
  {
    id: "hotels",
    label: "호텔 지점 관리",
    icon: Settings,
    href: "/admin/hotels",
    activeMatch: (pathname) => pathname === "/admin/hotels" || pathname.startsWith("/admin/hotels/"),
  },
  {
    id: "experience",
    label: "경험 페이지 관리",
    icon: Compass,
    href: "/admin/experience",
    activeMatch: (pathname) =>
      pathname === "/admin/experience" || pathname.startsWith("/admin/experience/"),
  },
  {
    id: "instagram",
    label: "인스타그램 관리",
    icon: PenLine,
    href: "/admin/instagram",
    activeMatch: (pathname) =>
      pathname === "/admin/instagram" || pathname.startsWith("/admin/instagram/"),
  },
  {
    id: "locations",
    label: "지점 페이지 관리",
    icon: MapPinned,
    href: "/admin/locations",
    activeMatch: (pathname) =>
      pathname === "/admin/garosugil" ||
      pathname.startsWith("/admin/garosugil/") ||
      pathname === "/admin/locations" ||
      pathname.startsWith("/admin/locations/"),
  },
  {
    id: "popup",
    label: "팝업창 관리",
    icon: MessageSquare,
    href: "/admin/popup",
    activeMatch: (pathname) => pathname === "/admin/popup" || pathname.startsWith("/admin/popup/"),
  },
  {
    id: "translations",
    label: "번역 사전 관리",
    icon: Languages,
    href: "/admin/translations",
    activeMatch: (pathname) =>
      pathname === "/admin/translations" || pathname.startsWith("/admin/translations/"),
  },
  {
    id: "account",
    label: "계정 설정",
    icon: User,
    href: "/admin/account",
    activeMatch: (pathname) => pathname === "/admin/account" || pathname.startsWith("/admin/account/"),
  },
];
