import { GarosugilFloorGuideSection } from "@/app/locations/garosugil/_components/floor-guide/GarosugilFloorGuideSection";
import { GarosugilGallerySection } from "@/app/locations/garosugil/_components/gallery/GarosugilGallerySection";
import { GarosugilHeroSection } from "@/app/locations/garosugil/_components/hero/GarosugilHeroSection";
import { GarosugilMomentsSection } from "@/app/locations/garosugil/_components/moments/GarosugilMomentsSection";
import { GarosugilPhilosophySection } from "@/app/locations/garosugil/_components/philosophy/GarosugilPhilosophySection";
import { GarosugilRoomCategoriesSection } from "@/app/locations/garosugil/_components/room-categories/GarosugilRoomCategoriesSection";
import { GarosugilSpecsSection } from "@/app/locations/garosugil/_components/specs/GarosugilSpecsSection";
import { getRequestLocale } from "@/lib/i18n-server";
import { fetchAdminLocationContent } from "@/lib/server/admin-location-content";
import { fetchAdminTranslationMap } from "@/lib/server/admin-translations";

type LocationLandingPageContentProps = {
  locationSlug: string;
};

export async function LocationLandingPageContent({
  locationSlug,
}: LocationLandingPageContentProps) {
  const locale = await getRequestLocale();
  const [content, translations] = await Promise.all([
    fetchAdminLocationContent(locationSlug),
    fetchAdminTranslationMap(),
  ]);

  return (
    <main className="flex-1 bg-[#fdfbf7]">
      <GarosugilHeroSection content={content.hero} locale={locale} translations={translations} />
      <GarosugilSpecsSection items={content.specs} locale={locale} translations={translations} />
      <GarosugilGallerySection content={content.gallery} locale={locale} translations={translations} />
      <GarosugilFloorGuideSection content={content.floorGuide} locale={locale} translations={translations} />
      <GarosugilRoomCategoriesSection content={content.roomCategories} locale={locale} translations={translations} />
      <GarosugilMomentsSection content={content.moments} locale={locale} translations={translations} />
      <GarosugilPhilosophySection content={content.philosophy} locale={locale} translations={translations} />
    </main>
  );
}
