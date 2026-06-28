import Image from "next/image";
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

type HomeStayExperienceSectionProps = {
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function HomeStayExperienceSection({ locale, translations }: HomeStayExperienceSectionProps) {
  const section = {
    sectionTitle: t(locale, translations, "home_stay_experience_section_title"),
    roomsTitle: t(locale, translations, "home_stay_rooms_title"),
    roomsDescription: t(locale, translations, "home_stay_rooms_description"),
    roomsCta: t(locale, translations, "home_stay_rooms_cta"),
    experienceTitle: t(locale, translations, "home_stay_experiences_title"),
    experienceDescription: t(locale, translations, "home_stay_experiences_description"),
    experienceCta: t(locale, translations, "home_stay_experiences_cta"),
  };
  const cards = [
    {
      eyebrow: "ROOMS",
      title: section.roomsTitle,
      description: section.roomsDescription,
      ctaLabel: section.roomsCta,
      href: "/locations/garosugil",
      image: "/images/section-images/R 1B03-GPT.png",
    },
    {
      eyebrow: "EXPERIENCES",
      title: section.experienceTitle,
      description: section.experienceDescription,
      ctaLabel: section.experienceCta,
      href: "/experience",
      image: "/images/section-images/OT06.jpg",
    },
  ] as const;

  return (
    <section className="bg-[#fff] px-4 py-28 max-[1024px]:px-5 max-[1024px]:py-20 max-[640px]:px-3 max-[640px]:py-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center">
          <p className="text-[14px] font-semibold tracking-[0.14em] text-[#9e7646] max-[1024px]:text-[13px] max-[640px]:text-[12px] max-[640px]:tracking-[0.12em]">
            STAY & EXPERIENCE
          </p>
          <h2 className="mt-2 text-[36px] font-bold tracking-[-0.05em] text-[#2d2926] max-[1024px]:text-[32px] max-[640px]:text-[26px] max-[640px]:leading-[1.15]">
            {section.sectionTitle}
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-12 max-[1024px]:mt-12 max-[1024px]:gap-8 max-[768px]:grid-cols-1 max-[768px]:gap-6 max-[640px]:mt-10 max-[640px]:gap-5">
          {cards.map((card) => (
            <article
              key={card.title}
              className="group relative overflow-hidden rounded-[24px] bg-[#d4c7b7] max-[640px]:rounded-[20px]"
            >
              <div className="absolute inset-0">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
              </div>

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,9,0.2)_0%,rgba(12,10,9,0.4)_46%,rgba(12,10,9,0.85)_100%)]" />

              <div className="relative flex min-h-[382px] flex-col justify-end px-10 pb-10 pt-12 text-white max-[1024px]:min-h-[340px] max-[1024px]:px-8 max-[1024px]:pb-8 max-[1024px]:pt-10 max-[768px]:min-h-[320px] max-[768px]:px-7 max-[768px]:pb-7 max-[768px]:pt-9 max-[640px]:min-h-[300px] max-[640px]:px-6 max-[640px]:pb-6 max-[640px]:pt-8">
                <p className="text-[10px] font-semibold tracking-[0.24em] text-white/80 max-[640px]:text-[9px]">
                  {card.eyebrow}
                </p>

                <h3 className="mt-4 text-[24px] font-bold leading-[1] tracking-[-0.04em] max-[1024px]:text-[22px] max-[640px]:text-[21px]">
                  {card.title}
                </h3>

                <p className="mt-5 max-w-[440px] text-[14px] leading-[1.5] text-white/72 max-[1024px]:text-[13px] max-[640px]:mt-4 max-[640px]:text-[13px]">
                  {card.description}
                </p>

                <div className="mt-6 max-[640px]:mt-5">
                  <Link
                    href={card.href}
                    className="group/link inline-flex items-center gap-2 text-[12px] font-bold text-white max-[1024px]:text-[11px]"
                  >
                    <span className="border-b border-white/35 pb-1 transition-colors duration-200 group-hover/link:border-white">
                      {card.ctaLabel}
                    </span>
                    <ChevronRightIcon />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
