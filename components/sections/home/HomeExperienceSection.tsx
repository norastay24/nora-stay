import Link from "next/link";
import type { AppLocale } from "@/lib/i18n";
import { t, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

type HomeExperienceSectionProps = {
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function HomeExperienceSection({ locale, translations }: HomeExperienceSectionProps) {
  const section = {
    title: t(locale, translations, "home_experience_title"),
    description: t(locale, translations, "home_experience_description"),
    ctaLabel: t(locale, translations, "home_experience_cta"),
  };

  return (
    <section className="relative overflow-hidden bg-[#0d1c25]">
      <div className="relative min-h-[500px] max-[1024px]:min-h-[460px] max-[640px]:min-h-[420px]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          suppressHydrationWarning
        >
          <source
            src="https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(7,18,27,0.85)] via-[rgba(7,18,27,0.6)] to-[rgba(7,18,27,0.4)] max-[640px]:bg-gradient-to-t max-[640px]:from-[rgba(7,18,27,0.88)] max-[640px]:via-[rgba(7,18,27,0.58)] max-[640px]:to-[rgba(7,18,27,0.28)]" />

        <div className="relative flex min-h-[500px] items-center px-16 py-10 text-white max-[1024px]:min-h-[460px] max-[1024px]:px-10 max-[640px]:min-h-[420px] max-[640px]:px-5 max-[640px]:py-8">
          <div className="max-w-[620px] max-[640px]:max-w-full">
            <p className="text-[14px] font-semibold tracking-[0.24em] text-white/80 max-[640px]:text-[12px] max-[640px]:tracking-[0.18em]">
              THE NORA EXPERIENCE
            </p>

            <h2 className="mt-8 whitespace-pre-line text-[48px] font-bold leading-[1.18] tracking-[-0.02em] max-[1024px]:mt-6 max-[1024px]:text-[42px] max-[640px]:mt-5 max-[640px]:text-[26px] max-[640px]:leading-[1.22]">
              {section.title}
            </h2>

            <p className="mt-12 whitespace-pre-line text-[16px] font-medium leading-[1.6] text-white/78 max-[1024px]:mt-9 max-[640px]:mt-6 max-[640px]:text-[13px] max-[640px]:leading-[1.7]">
              {section.description}
            </p>

            <Link
              href="/branches"
              className="mt-14 inline-flex items-center gap-3 rounded-full bg-[#8b6f47] px-8 py-3.5 text-[14px] font-bold text-white shadow-sm transition-colors duration-200 hover:bg-[#705835] max-[1024px]:mt-10 max-[640px]:mt-8 max-[640px]:px-6 max-[640px]:py-3 max-[640px]:text-[13px]"
            >
              <span>{section.ctaLabel}</span>
              <ChevronRightIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
