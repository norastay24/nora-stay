import { HomeHeroSection } from "@/components/sections/home/HomeHeroSection";
import { HomeAboutSection } from "@/components/sections/home/HomeAboutSection";
import { HomeCtaBannerSection } from "@/components/sections/home/HomeCtaBannerSection";
import { HomeExperienceSection } from "@/components/sections/home/HomeExperienceSection";
import { HomeFeaturesSection } from "@/components/sections/home/HomeFeaturesSection";
import { HomeInstagramSection } from "@/components/sections/home/HomeInstagramSection";
import { HomeLocationsSection } from "@/components/sections/home/HomeLocationsSection";
import { HomeStayExperienceSection } from "@/components/sections/home/HomeStayExperienceSection";
import { getRequestLocale } from "@/lib/i18n-server";
import { fetchAdminHomeSettings } from "@/lib/server/admin-home-settings";
import { fetchAdminInstagramDraft } from "@/lib/server/admin-instagram-settings";
import { fetchAdminTranslationMap } from "@/lib/server/admin-translations";

export default async function Home() {
  const locale = await getRequestLocale();
  const [instagramDraft, homeSettings, translations] = await Promise.all([
    fetchAdminInstagramDraft(),
    fetchAdminHomeSettings(),
    fetchAdminTranslationMap(),
  ]);

  return (
    <main className="flex-1 bg-[#faf9f5]">
      <HomeHeroSection bookingUrl={homeSettings.bookingUrl} locale={locale} translations={translations} />
      <HomeAboutSection locale={locale} translations={translations} />
      <HomeFeaturesSection locale={locale} translations={translations} />
      <HomeLocationsSection locale={locale} translations={translations} />
      <HomeExperienceSection locale={locale} translations={translations} />
      <HomeStayExperienceSection locale={locale} translations={translations} />
      <HomeInstagramSection
        campaignId={instagramDraft.campaignId}
        buddyLinkEn={instagramDraft.buddyLinkEn}
        footerEn={instagramDraft.footerEn}
        images={instagramDraft.images}
      />
      <HomeCtaBannerSection
        bookingUrl={homeSettings.bookingUrl}
        locale={locale}
        translations={translations}
      />
    </main>
  );
}
