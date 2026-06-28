import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  createDefaultGarosugilContent,
  type GarosugilPhilosophySectionContent,
} from "@/lib/garosugil-content";
import { type AppLocale } from "@/lib/i18n";
import {
  type TranslationDictionaryMap,
} from "@/lib/translation-dictionary";
import { translateKeyedLines, translateKeyedValue } from "@/lib/keyed-translations";

type GarosugilPhilosophySectionProps = {
  content?: GarosugilPhilosophySectionContent;
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function GarosugilPhilosophySection({
  content = createDefaultGarosugilContent().philosophy,
  locale,
  translations,
}: GarosugilPhilosophySectionProps) {
  const keyBase = "location.garosugil.philosophy";
  const title = translateKeyedLines(locale, translations, `${keyBase}.title`, content.title, content.titleEn);
  const description = translateKeyedLines(
    locale,
    translations,
    `${keyBase}.description`,
    content.description,
    content.descriptionEn,
  );

  return (
    <section className="bg-[#fff] px-6 py-24 md:px-10 md:py-28 max-[640px]:px-4 max-[640px]:py-12">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-14 max-[640px]:gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16">
        <div className="max-w-[470px]">
          <p className="text-[12px] font-bold tracking-[0.2em] text-[#b8894e] max-[640px]:text-[11px]">
            {translateKeyedValue(locale, translations, `${keyBase}.eyebrow`, content.eyebrow, content.eyebrowEn)}
          </p>

          <h2 className="mt-8 text-[30px] font-bold leading-[1.28] tracking-[-0.06em] text-[#101b34] md:text-[40px] max-[640px]:mt-5 max-[640px]:text-[26px]">
            <span className="block">{title[0]}</span>
            <span className="block">{title[1]}</span>
          </h2>

          <div className="mt-10 space-y-2 text-[14px] leading-[1.8] tracking-[-0.03em] text-[#7f8997] md:text-[14px] max-[640px]:mt-5 max-[640px]:text-[13px]">
            {description.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <Link
            href={content.brandHref}
            className="group mt-14 inline-flex items-center gap-3 text-[12px] font-bold tracking-[-0.04em] text-[#101b34] transition-colors duration-200 hover:text-[#9c7b4b] max-[640px]:mt-7"
          >
            <span>{translateKeyedValue(locale, translations, `${keyBase}.brand_label`, content.brandLabel, content.brandLabelEn)}</span>
            <ArrowRight
              className="h-[18px] w-[18px] transition-transform duration-300 ease-out group-hover:translate-x-1.5"
              strokeWidth={2.2}
            />
          </Link>
        </div>

        <div className="group relative overflow-hidden rounded-[24px] shadow-[0_20px_48px_rgba(17,24,39,0.12)] max-[640px]:rounded-[20px]">
          <div className="relative aspect-[1.6/1] overflow-hidden max-[640px]:h-[320px] max-[640px]:aspect-auto">
            <Image
              src={content.imageSrc}
              alt={content.imageAlt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 1024px) 100vw, 680px"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,27,52,0.12)_0%,rgba(16,27,52,0.5)_100%)]" />

            <div className="absolute inset-x-0 bottom-0 p-10 max-[640px]:p-4">
              <p className="max-w-[520px] text-[18px] font-bold leading-[1.5] tracking-[-0.04em] text-white md:text-[18px] max-[640px]:text-[15px]">
                {translateKeyedValue(locale, translations, `${keyBase}.overlay_text`, content.overlayText, content.overlayTextEn)}
              </p>

              <Link
                href={content.bookingHref}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex h-[54px] items-center gap-3 rounded-full bg-white px-8 text-[14px] font-bold tracking-[-0.04em] text-[#101b34] transition-colors duration-200 hover:bg-[#f3f4f6] max-[640px]:mt-4 max-[640px]:h-[38px] max-[640px]:px-5 max-[640px]:text-[11px]"
              >
                <span>{translateKeyedValue(locale, translations, `${keyBase}.booking_label`, content.bookingLabel, content.bookingLabelEn)}</span>
                <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
