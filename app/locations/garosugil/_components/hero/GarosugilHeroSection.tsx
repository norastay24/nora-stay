import Image from "next/image";
import Link from "next/link";
import { Flame, MapPin } from "lucide-react";
import { createDefaultGarosugilContent, type GarosugilHeroContent } from "@/lib/garosugil-content";
import { type AppLocale } from "@/lib/i18n";
import { translateKeyedLines, translateKeyedValue } from "@/lib/keyed-translations";
import type { TranslationDictionaryMap } from "@/lib/translation-dictionary";

type GarosugilHeroSectionProps = {
  content?: GarosugilHeroContent;
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function GarosugilHeroSection({
  content = createDefaultGarosugilContent().hero,
  locale,
  translations,
}: GarosugilHeroSectionProps) {
  const keyBase = "location.garosugil.hero";
  const title = translateKeyedLines(locale, translations, `${keyBase}.title`, content.title, content.titleEn);
  const description = translateKeyedLines(
    locale,
    translations,
    `${keyBase}.description`,
    content.description,
    content.descriptionEn,
  );

  return (
    <section className="relative isolate min-h-[calc(100vh-80px)] overflow-hidden bg-[#fdfbf7]">
      <div className="absolute inset-0">
        <Image
          src={content.imageSrc}
          alt={content.imageAlt}
          fill
          priority
          className="object-cover object-[72%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(253,251,247,0.98)_0%,rgba(253,251,247,0.96)_20%,rgba(253,251,247,0.86)_34%,rgba(253,251,247,0.18)_56%,rgba(253,251,247,0)_74%)]" />
        <div className="absolute inset-y-0 left-[28%] w-[34%] bg-[radial-gradient(circle,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.36)_52%,rgba(255,255,255,0)_100%)] blur-[28px]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[1200px] items-center px-6 py-20 md:px-10">
        <div className="max-w-[620px]">
          <div className="flex flex-wrap items-center gap-3 text-[14px] font-semibold tracking-[-0.03em] text-[#8b6f47]">
            <span>{translateKeyedValue(locale, translations, `${keyBase}.eyebrow`, content.eyebrow, content.eyebrowEn)}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#E1B057] to-[#C59B46] px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-white shadow-md animate-pulse">
              <span className="h-1 w-1 rounded-full bg-white" />
              {translateKeyedValue(locale, translations, `${keyBase}.badge`, content.badge)}
            </span>
          </div>

          <h1 className="mt-10 text-[60px] font-bold leading-[0.98] tracking-[-0.04em] text-[#101b34] sm:text-[64px] md:text-[68px]">
            <span className="block">{title[0]}</span>
            <span className="mt-3 block">{title[1]}</span>
          </h1>

          <div className="mt-8 space-y-1 text-[16px] font-medium leading-[1.75] tracking-[-0.04em] text-[#6f7d92] sm:text-[16px]">
            {description.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href={content.bookingHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[44px] items-center gap-2.5 rounded-full bg-[#9c7b4b] px-7 text-[12px] font-bold tracking-[-0.03em] text-white shadow-[0_10px_20px_rgba(156,123,75,0.24)] transition-colors duration-200 hover:bg-[#886a40]"
            >
              <Flame className="h-[15px] w-[15px]" strokeWidth={2.2} />
              <span>{translateKeyedValue(locale, translations, `${keyBase}.booking_label`, content.bookingLabel, content.bookingLabelEn)}</span>
            </Link>

            <Link
              href={content.mapHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[44px] items-center gap-2.5 rounded-full border border-[#e5ddd1] bg-white/92 px-7 text-[12px] font-bold tracking-[-0.03em] text-[#8f7248] shadow-[0_8px_20px_rgba(17,24,39,0.06)] transition-colors duration-200 hover:bg-[#fbfaf9]"
            >
              <MapPin className="h-[15px] w-[15px]" strokeWidth={2.2} />
              <span>{translateKeyedValue(locale, translations, `${keyBase}.map_label`, content.mapLabel, content.mapLabelEn)}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-9 left-7 hidden md:flex md:flex-col md:items-center md:gap-4">
        <span className="text-[11px] font-semibold tracking-[0.24em] text-[#9ea8b7] [writing-mode:vertical-rl]">
          SCROLL
        </span>
        <span className="h-16 w-px bg-[linear-gradient(180deg,rgba(161,170,182,0)_0%,rgba(161,170,182,0.75)_100%)]" />
      </div>
    </section>
  );
}
