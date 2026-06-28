"use client";

import { useState } from "react";
import type {
  AdminExperienceCategory,
  AdminExperienceItem,
} from "@/app/admin/_components/experience/admin-experience-shared";
import { ExperienceCategoryTabsSection } from "@/components/sections/experience/ExperienceCategoryTabsSection";
import { ExperienceConceptHotelsSection } from "@/components/sections/experience/ExperienceConceptHotelsSection";
import { commonMessages, type AppLocale } from "@/lib/i18n";
import { t, translateDictionaryText, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

type ExperienceCategoryContentSectionProps = {
  categories: AdminExperienceCategory[];
  items: AdminExperienceItem[];
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function ExperienceCategoryContentSection({
  categories,
  items,
  locale,
  translations,
}: ExperienceCategoryContentSectionProps) {
  const [activeCategoryId, setActiveCategoryId] = useState("experience-all");

  function handleSelectCategory(categoryId: string) {
    setActiveCategoryId(categoryId);
  }

  return (
    <>
      <ExperienceCategoryTabsSection
        activeCategoryId={activeCategoryId}
        categories={[
          {
            id: "experience-all",
            label: t(locale, translations, "experience_all", {
              ko: commonMessages.experience.ko.all,
              en: commonMessages.experience.en.all,
            }),
          },
          ...categories.map((category) => ({
            id: category.id,
            label: translateDictionaryText(locale, translations, category.titleKo, category.titleEn),
          })),
        ]}
        onSelectCategory={handleSelectCategory}
      />
      <div>
        <ExperienceConceptHotelsSection
          categories={categories}
          contentClassName={undefined}
          items={items}
          locale={locale}
          translations={translations}
          selectedCategoryId={activeCategoryId}
        />
      </div>
    </>
  );
}
