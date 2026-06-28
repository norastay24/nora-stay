import type { AppLocale } from "@/lib/i18n";
import type { AdminTranslationEntry } from "@/app/admin/_components/translations/admin-translations-shared";

export type TranslationDictionaryValue = {
  key: string;
  ko: string;
  en: string;
};

export type TranslationDictionaryMap = Record<string, TranslationDictionaryValue>;
export type TranslationFallback =
  | string
  | Partial<Record<AppLocale, string>>;

export function buildTranslationDictionaryMap(entries: AdminTranslationEntry[]): TranslationDictionaryMap {
  return Object.fromEntries(
    entries
      .map((entry) => entry.key.trim())
      .filter((key, index, keys) => key.length > 0 && keys.indexOf(key) === index)
      .map((key) => {
        const entry = entries.find((candidate) => candidate.key.trim() === key);

        return [
          key,
          {
            key,
            ko: entry?.ko.trim() ?? "",
            en: entry?.en.trim() ?? "",
          },
        ] as const;
      }),
  );
}

function resolveFallbackValue(locale: AppLocale, fallback?: TranslationFallback) {
  if (typeof fallback === "string") {
    return fallback.trim();
  }

  if (!fallback) {
    return "";
  }

  return (
    fallback[locale]?.trim() ||
    fallback.ko?.trim() ||
    fallback.en?.trim() ||
    ""
  );
}

export function t(
  locale: AppLocale,
  translations: TranslationDictionaryMap,
  key: string,
  fallback?: TranslationFallback,
) {
  const entry = translations[key];
  const fallbackValue = resolveFallbackValue(locale, fallback);

  if (!entry) {
    return fallbackValue || key;
  }

  const localized = entry[locale]?.trim();

  if (localized) {
    return localized;
  }

  return entry.ko.trim() || fallbackValue || key;
}

export function translateDictionaryText(
  locale: AppLocale,
  translations: TranslationDictionaryMap,
  sourceTextOrKey: string,
  fallbackEn?: string,
) {
  const normalizedValue = sourceTextOrKey.trim();

  if (normalizedValue && translations[normalizedValue]) {
    return t(locale, translations, normalizedValue);
  }

  if (locale === "en" && typeof fallbackEn === "string" && fallbackEn.trim().length > 0) {
    return fallbackEn;
  }

  return sourceTextOrKey;
}

export function translateDictionaryLines(
  locale: AppLocale,
  translations: TranslationDictionaryMap,
  sourceLines: string[],
  fallbackLines?: string[],
) {
  return sourceLines.map((line, index) =>
    translateDictionaryText(locale, translations, line, fallbackLines?.[index]),
  );
}
