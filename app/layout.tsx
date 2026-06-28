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
    default: "NORA STAY | 도시 속, 온전히 나에게 집중하는 시간",
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
    title: "NORA STAY | 도시 속, 온전히 나에게 집중하는 시간",
    description:
      "",
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
    title: "NORA STAY | 도시 속, 온전히 나에게 집중하는 시간",
    description:
      "노라스테이와 함께하는 특별한 휴식. 감각적인 공간과 차별화된 서비스를 제공하는 프라이빗 스테이에서 잊지 못할 여행의 순간을 경험하세요.",
    images: ["/images/seo.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: "pBOLp0HMacLLPVXWGHiWw5-AivKvnjIOpVa--1ABXHAs",
    other: {
      "naver-site-verification": "1inkA4AbTf1WsNlGuV8ndZ4XX0zakRjmzffn-9QcOm0",
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