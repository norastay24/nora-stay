import { ExperienceCategoryContentSection } from "@/components/sections/experience/ExperienceCategoryContentSection";
import { ExperienceCtaBannerSection } from "@/components/sections/experience/ExperienceCtaBannerSection";
import { ExperienceHeroSection } from "@/components/sections/experience/ExperienceHeroSection";
import { getRequestLocale } from "@/lib/i18n-server";
import { fetchAdminExperienceContent } from "@/lib/server/admin-experience-content";
import { fetchAdminTranslationMap } from "@/lib/server/admin-translations";
import { translateDictionaryText } from "@/lib/translation-dictionary";

export default async function ExperiencePage() {
  const locale = await getRequestLocale();
  const [content, translations] = await Promise.all([
    fetchAdminExperienceContent(),
    fetchAdminTranslationMap(),
  ]);
  const visibleCategories = content.categories.filter((category) => category.isVisible);
  const visibleItems = content.items.filter((item) => item.isVisible);

  return (
    <main className="flex-1 bg-[#fdfbf7]">
      <ExperienceHeroSection
        title={translateDictionaryText(
          locale,
          translations,
          content.settings.mainTitleKo,
          content.settings.mainTitleEn,
        )}
        description={
          translateDictionaryText(
            locale,
            translations,
            content.settings.descriptionKo,
            content.settings.descriptionEn,
          )
        }
      />
      <ExperienceCategoryContentSection
        locale={locale}
        categories={visibleCategories}
        items={visibleItems}
        translations={translations}
      />
      <ExperienceCtaBannerSection locale={locale} translations={translations} />
    </main>
  );
}
