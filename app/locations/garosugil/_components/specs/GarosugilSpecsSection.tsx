import { Building } from "lucide-react";
import { createDefaultGarosugilContent, type GarosugilSpecItem } from "@/lib/garosugil-content";
import { getLocalizedValue, type AppLocale } from "@/lib/i18n";
import { translateKeyedValue } from "@/lib/keyed-translations";
import type { TranslationDictionaryMap } from "@/lib/translation-dictionary";

type GarosugilSpecsSectionProps = {
  items?: GarosugilSpecItem[];
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function GarosugilSpecsSection({
  items = createDefaultGarosugilContent().specs,
  locale,
  translations,
}: GarosugilSpecsSectionProps) {
  return (
    <section className="border-b border-gray-100 bg-white py-10 md:py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-3 gap-x-2 gap-y-8 text-center md:grid-cols-6 md:divide-x md:divide-gray-100">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col items-center justify-center space-y-2.5 px-2"
            >
              <div className="rounded-xl bg-[#FAF9F5] p-2.5 text-[#8b6f47]">
                <Building className="h-5.5 w-5.5" strokeWidth={1.5} />
              </div>

              <div className="space-y-0.5">
                <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 md:text-[10px]">
                  {translateKeyedValue(locale, translations, `location.garosugil.specs.${item.id}.label`, item.label, item.labelEn)}
                </p>
                <p className="text-xs font-bold text-gray-900 md:text-xl">
                  {getLocalizedValue(locale, item.value, item.valueEn)}
                </p>
                <p className="text-[9px] font-light text-gray-500 md:text-xs">
                  {translateKeyedValue(locale, translations, `location.garosugil.specs.${item.id}.description`, item.description, item.descriptionEn)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
