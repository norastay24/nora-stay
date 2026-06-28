import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CommonHeader } from "@/components/CommonHeader";
import { CommonFooter } from "@/components/CommonFooter";
import { GlobalEventPopup } from "@/components/popup/GlobalEventPopup";
import { getRequestLocale } from "@/lib/i18n-server";
import { fetchAdminHotelBranches } from "@/lib/server/admin-hotel-branches";
import { fetchAdminInstagramDraft } from "@/lib/server/admin-instagram-settings";
import { fetchAdminPopupSettings } from "@/lib/server/admin-popup-settings";
import { fetchAdminTranslationMap } from "@/lib/server/admin-translations";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.norastay.com"),

  title: {
    default: "NORA STAY | 일상의 경계를 넘은, 조용한 휴식",
    template: "%s | NORA STAY",
  },

  description:
    "",

  keywords: [
    "노라스테이",
    "Nora Stay",
    "숙박 예약",
    "호텔 예약",
    "감성 숙소",
    "프라이빗 스테이",
    "호텔 추천",
    "여행 숙소",
    "스테이 플랫폼",
  ],

  alternates: {
    canonical: "https://www.norastay.com",
  },

  openGraph: {
    title: "NORA STAY | 일상의 경계를 넘은, 조용한 휴식",
    description:
      "NORA STAY는 프라이빗한 공간에서 편안한 휴식을 제공하는 프리미엄 스테이 브랜드입니다. 여행, 워케이션, 가족 모임, 기업 행사까지 머무는 모든 순간이 특별한 경험이 되도록 공간을 디자인합니다.",
    url: "https://www.norastay.com",
    siteName: "NORA STAY",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/images/seo.jpg",
        width: 1200,
        height: 630,
        alt: "NORA STAY",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "NORA STAY | 일상의 경계를 넘은, 조용한 휴식",
    description:
      "NORA STAY는 프라이빗한 공간에서 편안한 휴식을 제공하는 프리미엄 스테이 브랜드입니다. 여행, 워케이션, 가족 모임, 기업 행사까지 머무는 모든 순간이 특별한 경험이 되도록 공간을 디자인합니다.",
    images: ["/images/seo.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: "1inkA4AbTf1WsNlGuV8ndZ4XX0zakRjmzffn-9QcOm0",
    other: {
      "naver-site-verification": "a02aa1ceecb73f69bfe569b937207a5f3c990f7f",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const instagramDraft = await fetchAdminInstagramDraft();
  const popupSettings = await fetchAdminPopupSettings();
  const hotelBranches = await fetchAdminHotelBranches();
  const translations = await fetchAdminTranslationMap();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <CommonHeader branches={hotelBranches} locale={locale} translations={translations} />
        <GlobalEventPopup settings={popupSettings} locale={locale} translations={translations} />
        {children}
        <CommonFooter
          locale={locale}
          translations={translations}
          socialLinks={{
            buddyLinkKo: instagramDraft.buddyLinkKo,
            buddyLinkEn: instagramDraft.buddyLinkEn,
          }}
        />
      </body>
    </html>
  );
}
