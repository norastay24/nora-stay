import Image from "next/image";
import {
  createDefaultGarosugilContent,
  type GarosugilRoomCategoriesSectionContent,
} from "@/lib/garosugil-content";
import { type AppLocale } from "@/lib/i18n";
import {
  type TranslationDictionaryMap,
} from "@/lib/translation-dictionary";
import { translateKeyedLines, translateKeyedValue } from "@/lib/keyed-translations";

type GarosugilRoomCategoriesSectionProps = {
  content?: GarosugilRoomCategoriesSectionContent;
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function GarosugilRoomCategoriesSection({
  content = createDefaultGarosugilContent().roomCategories,
  locale,
  translations,
}: GarosugilRoomCategoriesSectionProps) {
  const keyBase = "location.garosugil.room_categories";
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 space-y-2">
          <span className="block text-xs font-semibold uppercase tracking-widest text-[#8b6f47]">
            {translateKeyedValue(locale, translations, `${keyBase}.eyebrow`, content.eyebrow, content.eyebrowEn)}
          </span>
          <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {translateKeyedValue(locale, translations, `${keyBase}.title`, content.title, content.titleEn)}
          </h3>
          <p className="max-w-2xl text-xs font-light leading-relaxed text-gray-500 sm:text-sm">
            {translateKeyedValue(locale, translations, `${keyBase}.description`, content.description, content.descriptionEn)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {content.items.map((room) => {
            const description = translateKeyedLines(locale, translations, `${keyBase}.item.${room.id}.description`, room.description, room.descriptionEn);

            return (
              <article
                key={room.id}
                className="group flex flex-col items-center gap-6 overflow-hidden rounded-2xl border border-gray-100 bg-[#FAF9F5] p-6 transition-shadow hover:shadow-md md:flex-row"
              >
                <div className="aspect-[16/11] w-full shrink-0 overflow-hidden rounded-xl md:w-[45%]">
                  <Image
                    src={room.imageSrc}
                    alt={room.imageAlt}
                    width={400}
                    height={275}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-2">
                  <span className="block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#8b6f47]">
                    {translateKeyedValue(locale, translations, `${keyBase}.item.${room.id}.eyebrow`, room.eyebrow, room.eyebrowEn)}
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    {translateKeyedValue(locale, translations, `${keyBase}.item.${room.id}.title`, room.title, room.titleEn)}
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
