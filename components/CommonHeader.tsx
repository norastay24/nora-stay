import type { AdminHotelBranch } from "@/app/admin/_components/hotels/admin-hotels-shared";
import { CommonHeaderClient } from "@/components/CommonHeaderClient";
import type { AppLocale } from "@/lib/i18n";
import type { TranslationDictionaryMap } from "@/lib/translation-dictionary";

type CommonHeaderProps = {
  branches: AdminHotelBranch[];
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function CommonHeader({ branches, locale, translations }: CommonHeaderProps) {
  return <CommonHeaderClient branches={branches} locale={locale} translations={translations} />;
}
