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
    <section className="bg-[#fff] px-4 py-28">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center">
          <p className="text-[14px] font-semibold tracking-[0.14em] text-[#9e7646]">
            STAY & EXPERIENCE
          </p>
          <h2 className="mt-2 text-[36px] font-bold tracking-[-0.05em] text-[#2d2926]">
            {section.sectionTitle}
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-12">
          {cards.map((card) => (
            <article
              key={card.title}
              className="group relative overflow-hidden rounded-[24px] bg-[#d4c7b7]"
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

              <div className="relative flex min-h-[382px] flex-col justify-end px-10 pb-10 pt-12 text-white">
                <p className="text-[10px] font-semibold tracking-[0.24em] text-white/80">
                  {card.eyebrow}
                </p>

                <h3 className="mt-4 text-[24px] font-bold leading-[1] tracking-[-0.04em]">
                  {card.title}
                </h3>

                <p className="mt-5 text-[14px] leading-[1.4] text-white/72">
                  {card.description}
                </p>

                <div className="mt-6">
                  <Link
                    href={card.href}
                    className="group/link inline-flex items-center gap-2 text-[12px] font-bold text-white"
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
