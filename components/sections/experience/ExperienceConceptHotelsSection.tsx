import Image from "next/image";
import type {
  AdminExperienceCategory,
  AdminExperienceItem,
} from "@/app/admin/_components/experience/admin-experience-shared";
import type { AppLocale } from "@/lib/i18n";
import { translateDictionaryText, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

type ExperienceConceptHotelsSectionProps = {
  categories: AdminExperienceCategory[];
  contentClassName?: string;
  items: AdminExperienceItem[];
  locale: AppLocale;
  translations: TranslationDictionaryMap;
  selectedCategoryId: string;
};

export function ExperienceConceptHotelsSection({
  categories,
  contentClassName,
  items,
  locale,
  translations,
  selectedCategoryId,
}: ExperienceConceptHotelsSectionProps) {
  const visibleCategories =
    selectedCategoryId === "experience-all"
      ? categories
      : categories.filter((category) => category.id === selectedCategoryId);

  return (
    <section id="experience-all" className="bg-[#f8f5ef] px-8 py-[56px] max-[1024px]:px-6 max-[640px]:px-4 max-[640px]:py-12">
      <div
        className={["mx-auto max-w-[1200px] space-y-16 max-[1024px]:space-y-14 max-[640px]:space-y-12", contentClassName ?? ""].join(" ").trim()}
      >
        {visibleCategories.map((category) => {
          const categoryItems = items.filter(
            (item) => item.categoryId === category.id && item.isVisible,
          );

          if (!category.isVisible || categoryItems.length === 0) {
            return null;
          }

          return (
            <div key={category.id} id={`experience-category-${category.id}`}>
              <div
                key={`${selectedCategoryId}-${category.id}`}
                className="animate-[experience-category-rise_700ms_cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[30px] font-extrabold leading-none tracking-[-0.04em] text-[#f1d9ab] max-[640px]:text-[24px]">
                    {String(category.sortOrder).padStart(2, "0")}
                  </span>
                  <span className="pt-[10px] text-[12px] font-bold tracking-[-0.03em] text-[#a9783f] max-[640px]:pt-[7px] max-[640px]:text-[11px]">
                    {translateDictionaryText(locale, translations, category.titleKo, category.titleEn)}
                  </span>
                </div>

                <p className="mt-5 text-[20px] font-medium tracking-[-0.05em] text-[#6f8095] max-[640px]:mt-4 max-[640px]:text-[17px]">
                  {translateDictionaryText(
                    locale,
                    translations,
                    category.subtitleKo,
                    category.subtitleEn,
                  )}
                </p>

                <h2 className="mt-3 text-[30px] font-extrabold leading-[1.28] tracking-[-0.02em] text-[#152033] max-[1024px]:text-[27px] max-[640px]:text-[22px]">
                  {translateDictionaryText(
                    locale,
                    translations,
                    category.descriptionKo,
                    category.descriptionEn,
                  )}
                </h2>

                <div className="mt-8 h-px w-full bg-[#ece6dd]" />

                <div className="mt-10 grid min-h-[420px] grid-cols-3 items-start gap-10 max-[1024px]:grid-cols-2 max-[1024px]:gap-7 max-[640px]:grid-cols-1 max-[640px]:gap-5">
                  {categoryItems.map((card) => (
                    <article
                      key={card.id}
                      className="overflow-hidden rounded-[24px] border border-[#eee8de] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.03)] max-[640px]:rounded-[20px]"
                    >
                      <div className="relative h-[242px] w-full overflow-hidden max-[640px]:h-[220px]">
                        <Image
                          src={card.imageUrl}
                          alt={translateDictionaryText(locale, translations, card.titleKo, card.titleEn)}
                          fill
                          className="object-cover"
                          sizes="400px"
                        />
                      </div>

                      <div className="px-6 pb-6 pt-5 max-[640px]:px-5 max-[640px]:pb-5 max-[640px]:pt-4">
                        <h3 className="text-[18px] font-extrabold tracking-[-0.05em] text-[#152033] max-[640px]:text-[16px]">
                          {translateDictionaryText(locale, translations, card.titleKo, card.titleEn)}
                        </h3>
                        <p className="mt-5 text-[14px] leading-[1.6] tracking-[-0.04em] text-[#6a788a] max-[640px]:mt-4 max-[640px]:text-[13px]">
                          {translateDictionaryText(
                            locale,
                            translations,
                            card.descriptionKo,
                            card.descriptionEn,
                          )}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        @keyframes experience-category-rise {
          from {
            opacity: 0;
            transform: translate3d(0, 22px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </section>
  );
}
