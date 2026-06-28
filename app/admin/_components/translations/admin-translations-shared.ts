import type { AppLocale } from "@/lib/i18n";

export type AdminTranslationEntry = {
  id: string;
  key: string;
  ko: string;
  en: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminTranslationLocaleField = Exclude<AppLocale, never>;

export const TRANSLATION_LOCALE_FIELDS: AppLocale[] = ["ko", "en"];

export function createEmptyAdminTranslationEntry() {
  return {
    id: `translation-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    key: "",
    ko: "",
    en: "",
  } satisfies AdminTranslationEntry;
}
