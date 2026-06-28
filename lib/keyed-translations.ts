import type { AppLocale } from "@/lib/i18n";
import { t, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

export function translateKeyedValue(
  locale: AppLocale,
  translations: TranslationDictionaryMap,
  key: string,
  fallbackKo: string,
  fallbackEn?: string,
) {
  const normalizedKey = key.trim();

  if (normalizedKey && translations[normalizedKey]) {
    return t(locale, translations, normalizedKey, fallbackKo);
  }

  if (locale === "en" && typeof fallbackEn === "string" && fallbackEn.trim().length > 0) {
    return fallbackEn;
  }

  return fallbackKo;
}

export function translateKeyedLines(
  locale: AppLocale,
  translations: TranslationDictionaryMap,
  keyPrefix: string,
  fallbackKo: string[],
  fallbackEn?: string[],
) {
  return fallbackKo.map((line, index) =>
    translateKeyedValue(
      locale,
      translations,
      `${keyPrefix}.${index + 1}`,
      line,
      fallbackEn?.[index],
    ),
  );
}
