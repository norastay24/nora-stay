import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { AppLocale } from "@/lib/i18n";
import { t, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

type HomeCtaBannerSectionProps = {
  bookingUrl: string;
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

function DotIcon() {
  return (
    <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-white shadow-inner">
      <span className="h-1 w-1 rounded-full bg-[#8b6f47]" />
    </span>
  );
}

export function HomeCtaBannerSection({ bookingUrl, locale, translations }: HomeCtaBannerSectionProps) {
  const section = {
    title: t(locale, translations, "home_cta_title"),
    description: t(locale, translations, "home_cta_description"),
    ctaLabel: t(locale, translations, "reserve_button"),
  };

  return (
    <section className="relative min-h-[200px] overflow-hidden">
      <Image
        src="/images/section-images/가로수길점.jpg"
        alt="배경 이미지"
        fill
        className="object-cover"
        style={{ objectPosition: "center 23%" }}
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative mx-auto flex min-h-[200px] max-w-[1200px] items-center justify-between px-16 py-10 text-white">
        <div className="max-w-[460px]">
          <h2 className="whitespace-pre-line text-[30px] font-bold leading-[1.35] tracking-[-0.05em]">
            {section.title}
          </h2>
          <p className="mt-2 text-[14px] font-medium leading-[1.8] text-white/75">
            {section.description}
          </p>
        </div>

        <Link
          href={bookingUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 rounded-full bg-[#8b6f47] px-8 py-4 text-[12px] font-bold text-white transition-colors duration-200 hover:bg-[#705835]"
        >
          <DotIcon />
          <span>{section.ctaLabel}</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
