import Link from "next/link";
import { Poppins } from "next/font/google";
import type { AppLocale } from "@/lib/i18n";
import { t, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

function AirbnbIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5.1c1.37 0 2.38 1.6 4.09 5.18 1.36 2.83 2.55 5.6 2.55 7.03A3.7 3.7 0 0 1 15 21c-1.27 0-2.14-.6-3-1.77C11.14 20.4 10.27 21 9 21a3.7 3.7 0 0 1-3.64-3.69c0-1.43 1.19-4.2 2.55-7.03C9.62 6.7 10.63 5.1 12 5.1Z" />
      <path d="M9.24 16.82a2.76 2.76 0 0 0 5.52 0c0-1.52-1.28-3.86-2.33-5.75a.5.5 0 0 0-.86 0c-1.05 1.89-2.33 4.23-2.33 5.75Z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[14px] w-[14px] text-rose-500 transition-colors group-hover:text-white"
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

type HomeHeroSectionProps = {
  bookingUrl: string;
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function HomeHeroSection({ bookingUrl, locale, translations }: HomeHeroSectionProps) {
  const hero = {
    primaryChip: t(locale, translations, "home_hero_primary_chip"),
    secondaryChip: t(locale, translations, "home_hero_secondary_chip"),
    eyebrow: t(locale, translations, "home_hero_eyebrow"),
    title: [
      t(locale, translations, "home_hero_title_line_1"),
      t(locale, translations, "home_hero_title_line_2"),
    ],
    meta: t(locale, translations, "home_hero_meta"),
    ctaLabel: t(locale, translations, "reserve_button"),
  };

  return (
    <section className="bg-[#faf9f5] px-4 pt-6 max-[640px]:px-3">
      <div
        className="relative mx-auto aspect-[16/9.5] max-w-[1200px] overflow-hidden rounded-[32px] border border-black/5 bg-cover bg-center bg-no-repeat shadow-lg max-[1024px]:aspect-[16/11] max-[768px]:aspect-[4/5] max-[640px]:rounded-[24px]"
        style={{ backgroundImage: "url(/images/section-images/chat_2_0ca9a92d.png)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent max-[768px]:bg-gradient-to-t max-[768px]:from-black/65 max-[768px]:via-black/20 max-[768px]:to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between p-16 text-white max-[1024px]:p-10 max-[768px]:p-8 max-[640px]:p-5">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#8b6f47] px-3 py-1 text-[10px] font-bold tracking-wider text-white shadow-sm max-[640px]:px-2.5 max-[640px]:text-[9px]">
              {hero.primaryChip}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md max-[640px]:px-2.5 max-[640px]:text-[9px]">
              {hero.secondaryChip}
            </span>
          </div>

          <div className="my-auto max-w-xl space-y-3 max-[768px]:max-w-[88%] max-[640px]:max-w-full max-[640px]:space-y-2.5">
            <p className="text-sm font-light tracking-wide text-white/90 max-[640px]:text-[11px]">
              {hero.eyebrow}
            </p>

            <h1
              className={`${poppins.className} whitespace-pre-line text-6xl font-[900] leading-[1.05] tracking-tight drop-shadow-sm max-[1024px]:text-5xl max-[768px]:text-[42px] max-[640px]:text-[30px] max-[640px]:leading-[1.12]`}
            >
              {hero.title.join("\n")}
            </h1>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e5d8cd] max-[640px]:text-[10px] max-[640px]:tracking-[0.18em]">
              {hero.meta}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href={bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-[#22232a] shadow-md transition-all duration-150 hover:bg-[#8b6f47] hover:text-white hover:shadow-lg active:scale-95 max-[640px]:px-5 max-[640px]:py-2.5 max-[640px]:text-[11px]"
            >
              <span className="text-[#ff2056] transition-colors group-hover:text-white">
                <AirbnbIcon />
              </span>
              <span>{hero.ctaLabel}</span>
              <ChevronRightIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
