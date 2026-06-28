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
  title: "Nora Stay",
  description: "Nora Stay",
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
