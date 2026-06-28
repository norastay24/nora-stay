import {
  createDefaultGarosugilContent,
  type GarosugilMomentsSectionContent,
} from "@/lib/garosugil-content";
import { type AppLocale } from "@/lib/i18n";
import {
  type TranslationDictionaryMap,
} from "@/lib/translation-dictionary";
import { translateKeyedLines, translateKeyedValue } from "@/lib/keyed-translations";

type GarosugilMomentsSectionProps = {
  content?: GarosugilMomentsSectionContent;
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function GarosugilMomentsSection({
  content = createDefaultGarosugilContent().moments,
  locale,
  translations,
}: GarosugilMomentsSectionProps) {
  const keyBase = "location.garosugil.moments";
  return (
    <section className="bg-[#faf9f5] py-20 sm:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 space-y-2 text-center">
          <span className="block text-xs font-semibold uppercase tracking-widest text-[#8b6f47]">
            {translateKeyedValue(locale, translations, `${keyBase}.eyebrow`, content.eyebrow, content.eyebrowEn)}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {translateKeyedValue(locale, translations, `${keyBase}.title`, content.title, content.titleEn)}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-6">
          {content.items.map((moment) => {
            const description = translateKeyedLines(locale, translations, `${keyBase}.item.${moment.id}.description`, moment.description, moment.descriptionEn);

            return (
              <article
                key={moment.id}
                className="flex flex-col items-center space-y-3 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="text-2xl" aria-hidden="true">
                  {moment.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-900">
                    {translateKeyedValue(locale, translations, `${keyBase}.item.${moment.id}.title`, moment.title, moment.titleEn)}
                  </h4>
                  <div className="text-[10px] font-light text-gray-400">
                    {description.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
