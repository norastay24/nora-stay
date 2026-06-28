import Image from "next/image";
import {
  createDefaultGarosugilContent,
  type GarosugilFloorGuideSectionContent,
} from "@/lib/garosugil-content";
import { type AppLocale } from "@/lib/i18n";
import {
  type TranslationDictionaryMap,
} from "@/lib/translation-dictionary";
import { translateKeyedLines, translateKeyedValue } from "@/lib/keyed-translations";

type GarosugilFloorGuideSectionProps = {
  content?: GarosugilFloorGuideSectionContent;
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function GarosugilFloorGuideSection({
  content = createDefaultGarosugilContent().floorGuide,
  locale,
  translations,
}: GarosugilFloorGuideSectionProps) {
  const keyBase = "location.garosugil.floor_guide";
  const primaryCards = content.cards.filter((card) => card.size === "large");
  const secondaryCards = content.cards.filter((card) => card.size === "wide");

  return (
    <section className="border-b border-t border-gray-100 bg-white py-20 sm:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 space-y-2">
          <span className="block text-xs font-semibold uppercase tracking-widest text-[#8b6f47]">
            {translateKeyedValue(locale, translations, `${keyBase}.eyebrow`, content.eyebrow, content.eyebrowEn)}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {translateKeyedValue(locale, translations, `${keyBase}.title`, content.title, content.titleEn)}
          </h2>
          <p className="max-w-2xl text-xs font-light leading-relaxed text-gray-500 sm:text-sm">
            {translateKeyedValue(locale, translations, `${keyBase}.description`, content.description, content.descriptionEn)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {primaryCards.map((card) => {
            const description = translateKeyedLines(locale, translations, `${keyBase}.card.${card.id}.description`, card.description, card.descriptionEn);

            return (
              <article
                key={card.id}
                className="group flex aspect-[3/3.6] flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-[#FAF9F5] transition-shadow hover:shadow-md"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <Image
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    width={400}
                    height={250}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div className="space-y-1.5">
                    <span className="block text-[13px] font-extrabold uppercase tracking-[0.1em] text-[#8b6f47]">
                      {translateKeyedValue(locale, translations, `${keyBase}.card.${card.id}.eyebrow`, card.eyebrow, card.eyebrowEn)}
                    </span>
                    <h3 className="text-base font-bold text-gray-900">
                      {translateKeyedValue(locale, translations, `${keyBase}.card.${card.id}.title`, card.title, card.titleEn)}
                    </h3>
                    <div className="whitespace-pre-line text-xs font-light leading-relaxed text-gray-500">
                      {description.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {secondaryCards.map((card) => {
            const description = translateKeyedLines(locale, translations, `${keyBase}.card.${card.id}.description`, card.description, card.descriptionEn);

            return (
              <article
                key={card.id}
                className="group flex flex-col items-center gap-6 overflow-hidden rounded-2xl border border-gray-100 bg-[#FAF9F5] p-6 transition-shadow hover:shadow-md md:flex-row"
              >
                <div className="aspect-[16/11] h-full w-full shrink-0 overflow-hidden rounded-xl md:w-[45%]">
                  <Image
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    width={300}
                    height={200}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <span className="block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#8b6f47]">
                    {translateKeyedValue(locale, translations, `${keyBase}.card.${card.id}.eyebrow`, card.eyebrow, card.eyebrowEn)}
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    {translateKeyedValue(locale, translations, `${keyBase}.card.${card.id}.title`, card.title, card.titleEn)}
                  </h3>
                  <div className="text-xs font-light leading-relaxed text-gray-500">
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
