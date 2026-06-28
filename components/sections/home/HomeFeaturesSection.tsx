import type { AppLocale } from "@/lib/i18n";
import { t, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

type HomeFeaturesSectionProps = {
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function HomeFeaturesSection({ locale, translations }: HomeFeaturesSectionProps) {
  const featureItems = [
    {
      number: "01",
      icon: "🏡",
      title: t(locale, translations, "home_features_01_title"),
      description: t(locale, translations, "home_features_01_description"),
    },
    {
      number: "02",
      icon: "📍",
      title: t(locale, translations, "home_features_02_title"),
      description: t(locale, translations, "home_features_02_description"),
    },
    {
      number: "03",
      icon: "🧴",
      title: t(locale, translations, "home_features_03_title"),
      description: t(locale, translations, "home_features_03_description"),
    },
    {
      number: "04",
      icon: "🪑",
      title: t(locale, translations, "home_features_04_title"),
      description: t(locale, translations, "home_features_04_description"),
    },
    {
      number: "05",
      icon: "🛏",
      title: t(locale, translations, "home_features_05_title"),
      description: t(locale, translations, "home_features_05_description"),
    },
    {
      number: "06",
      icon: "🏘",
      title: t(locale, translations, "home_features_06_title"),
      description: t(locale, translations, "home_features_06_description"),
    },
  ];

  return (
    <section className="bg-[#faf9f5] px-4 py-20 max-[1024px]:py-16 max-[640px]:px-3 max-[640px]:py-14">
      <div className="mx-auto max-w-[1200px] overflow-hidden border border-[#ece7de] bg-white shadow-sm">
        <div className="grid grid-cols-3 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1">
          {featureItems.map((item, index) => (
            <article
              key={item.number}
              className={[
                "group min-h-[272px] bg-white px-10 py-10 transition-colors duration-300 ease-out hover:bg-[#fdfdfb] max-[1024px]:min-h-[240px] max-[1024px]:px-8 max-[1024px]:py-8 max-[640px]:min-h-0 max-[640px]:px-6 max-[640px]:py-7",
                index % 3 !== 2 ? "border-r border-[#f0ece4] max-[1024px]:border-r-0" : "",
                index < 3 ? "border-b border-[#f0ece4] max-[1024px]:border-b-0" : "",
                index % 2 === 0 ? "max-[1024px]:border-r max-[1024px]:border-[#f0ece4] max-[640px]:border-r-0" : "",
                index < featureItems.length - 2 ? "max-[1024px]:border-b max-[1024px]:border-[#f0ece4]" : "",
                index < featureItems.length - 1 ? "max-[640px]:border-b max-[640px]:border-[#f0ece4]" : "",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <span className="text-[30px] font-extralight tracking-[0.08em] text-[#ddb898] max-[640px]:text-[26px]">
                  {item.number}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-100/50 bg-amber-50 text-[24px] shadow-inner transition-transform duration-300 ease-out group-hover:scale-110 max-[640px]:h-11 max-[640px]:w-11 max-[640px]:text-[22px]">
                  {item.icon}
                </span>
              </div>

              <h3 className="mt-4 text-[16px] font-bold tracking-[-0.04em] text-[#182235] max-[640px]:text-[15px]">
                {item.title}
              </h3>

              <p className="mt-5 max-w-[248px] text-[14px] leading-[1.85] tracking-[-0.02em] text-[#8a93a3] max-[1024px]:max-w-full max-[640px]:mt-4 max-[640px]:text-[13px]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
