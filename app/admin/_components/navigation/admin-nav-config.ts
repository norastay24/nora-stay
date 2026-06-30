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
import { buildAdminPublicPath } from "@/lib/admin-routes";

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
    href: buildAdminPublicPath("/admin"),
    activeMatch: (pathname) => pathname === buildAdminPublicPath("/admin"),
  },
  {
    id: "hotels",
    label: "호텔 지점 관리",
    icon: Settings,
    href: buildAdminPublicPath("/admin/hotels"),
    activeMatch: (pathname) =>
      pathname === buildAdminPublicPath("/admin/hotels") ||
      pathname.startsWith(`${buildAdminPublicPath("/admin/hotels")}/`),
  },
  {
    id: "experience",
    label: "경험 페이지 관리",
    icon: Compass,
    href: buildAdminPublicPath("/admin/experience"),
    activeMatch: (pathname) =>
      pathname === buildAdminPublicPath("/admin/experience") ||
      pathname.startsWith(`${buildAdminPublicPath("/admin/experience")}/`),
  },
  {
    id: "instagram",
    label: "인스타그램 관리",
    icon: PenLine,
    href: buildAdminPublicPath("/admin/instagram"),
    activeMatch: (pathname) =>
      pathname === buildAdminPublicPath("/admin/instagram") ||
      pathname.startsWith(`${buildAdminPublicPath("/admin/instagram")}/`),
  },
  {
    id: "locations",
    label: "지점 페이지 관리",
    icon: MapPinned,
    href: buildAdminPublicPath("/admin/locations"),
    activeMatch: (pathname) =>
      pathname === buildAdminPublicPath("/admin/garosugil") ||
      pathname.startsWith(`${buildAdminPublicPath("/admin/garosugil")}/`) ||
      pathname === buildAdminPublicPath("/admin/locations") ||
      pathname.startsWith(`${buildAdminPublicPath("/admin/locations")}/`),
  },
  {
    id: "popup",
    label: "팝업창 관리",
    icon: MessageSquare,
    href: buildAdminPublicPath("/admin/popup"),
    activeMatch: (pathname) =>
      pathname === buildAdminPublicPath("/admin/popup") ||
      pathname.startsWith(`${buildAdminPublicPath("/admin/popup")}/`),
  },
  {
    id: "translations",
    label: "번역 사전 관리",
    icon: Languages,
    href: buildAdminPublicPath("/admin/translations"),
    activeMatch: (pathname) =>
      pathname === buildAdminPublicPath("/admin/translations") ||
      pathname.startsWith(`${buildAdminPublicPath("/admin/translations")}/`),
  },
  {
    id: "account",
    label: "계정 설정",
    icon: User,
    href: buildAdminPublicPath("/admin/account"),
    activeMatch: (pathname) =>
      pathname === buildAdminPublicPath("/admin/account") ||
      pathname.startsWith(`${buildAdminPublicPath("/admin/account")}/`),
  },
];
