import Image from "next/image";
import Link from "next/link";
import { commonMessages, type AppLocale } from "@/lib/i18n";
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

type ExperienceCtaBannerSectionProps = {
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function ExperienceCtaBannerSection({
  locale,
  translations,
}: ExperienceCtaBannerSectionProps) {
  const messages = {
    ctaTitle: t(locale, translations, "experience_cta_title", {
      ko: commonMessages.experience.ko.ctaTitle,
      en: commonMessages.experience.en.ctaTitle,
    }),
    ctaDescription: t(locale, translations, "experience_cta_description", {
      ko: commonMessages.experience.ko.ctaDescription,
      en: commonMessages.experience.en.ctaDescription,
    }),
    ctaButton: t(locale, translations, "experience_cta_button", {
      ko: commonMessages.experience.ko.ctaButton,
      en: commonMessages.experience.en.ctaButton,
    }),
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[320px] max-[640px]:h-[280px]">
        <Image
          src="/images/section-images/experience/photo-2.jpg"
          alt="Nora Stay stay scene"
          fill
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-[#1a1715] opacity-90" />

        <div className="relative mx-auto flex h-full max-w-[1200px] flex-col items-center justify-center px-8 text-center text-white max-[640px]:px-5">
          <h2 className="text-[30px] font-bold leading-[1.2] tracking-[-0.06em] max-[1024px]:text-[27px] max-[640px]:text-[22px]">
            {messages.ctaTitle.split("\n").map((line, index) => (
              <span key={`${line}-${index}`}>
                {index > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </h2>

          <p className="mt-6 text-[14px] leading-[1.7] tracking-[-0.03em] text-white/78 max-[640px]:mt-5 max-[640px]:text-[13px]">
            {messages.ctaDescription.split("\n").map((line, index) => (
              <span key={`${line}-${index}`}>
                {index > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </p>

          <Link
            href="/locations/garosugil"
            className="mt-6 inline-flex h-[40px] items-center gap-3 rounded-full bg-[#8b6f47] px-9 text-[12px] font-bold tracking-[-0.03em] text-white transition-colors duration-200 hover:bg-[#e1b057] max-[640px]:mt-5 max-[640px]:h-[38px] max-[640px]:px-7 max-[640px]:text-[11px]"
          >
            <span>{messages.ctaButton}</span>
            <ChevronRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
