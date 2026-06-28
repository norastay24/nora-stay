import Image from "next/image";
import Link from "next/link";
import type { AppLocale } from "@/lib/i18n";
import { t, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

type HomeAboutSectionProps = {
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function HomeAboutSection({ locale, translations }: HomeAboutSectionProps) {
  const about = {
    eyebrow: t(locale, translations, "home_about_eyebrow"),
    title: t(locale, translations, "home_about_title"),
    description: t(locale, translations, "home_about_description"),
    ctaLabel: t(locale, translations, "home_about_cta"),
  };

  return (
    <section className="bg-[#fff] px-4 py-44 max-[1024px]:py-28 max-[640px]:px-5 max-[640px]:py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[460px_600px] items-center justify-between gap-16 max-[1024px]:grid-cols-1 max-[1024px]:gap-12">
        <div className="space-y-6 max-[640px]:space-y-5">
          <span className="block text-sm font-semibold uppercase tracking-[0.24em] text-[#8B6F47] max-[640px]:text-[12px] max-[640px]:tracking-[0.18em]">
            {about.eyebrow}
          </span>

          <div className="space-y-4 max-[640px]:space-y-3">
            <h2 className="whitespace-pre-line text-[32px] font-bold leading-[1.35] tracking-[-0.04em] text-[#111827] max-[1024px]:text-[30px] max-[640px]:text-[24px]">
              {about.title}
            </h2>
            <p className="text-sm leading-[1.8] text-[#6b7280] max-[640px]:text-[13px]">
              {about.description}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/branches"
              className="inline-flex items-center gap-1 border-b border-[#111827] pb-1.5 text-xs font-bold text-[#111827] transition-colors duration-200 hover:border-[#a13c00] hover:text-[#a13c00]"
            >
              <span>{about.ctaLabel}</span>
              <ArrowRightIcon />
            </Link>
          </div>
        </div>

        <div className="group relative aspect-[1.08/1] w-full overflow-hidden rounded-[28px] shadow-[0_16px_40px_rgba(17,24,39,0.10)] max-[1024px]:max-w-[760px] max-[640px]:aspect-[1/1.06] max-[640px]:rounded-[22px]">
          <Image
            src="/images/section-images/living_room_26132072.jpg"
            alt="Nora Stay living room terrace"
            width={600}
            height={548}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
