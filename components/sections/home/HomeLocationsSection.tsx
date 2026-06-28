import { fetchAdminHotelBranches } from "@/lib/server/admin-hotel-branches";
import { HomeLocationsSectionClient } from "@/components/sections/home/HomeLocationsSectionClient";
import type { AppLocale } from "@/lib/i18n";
import type { TranslationDictionaryMap } from "@/lib/translation-dictionary";

type HomeLocationsSectionProps = {
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export async function HomeLocationsSection({ locale, translations }: HomeLocationsSectionProps) {
  const branches = await fetchAdminHotelBranches();

  return <HomeLocationsSectionClient branches={branches} locale={locale} translations={translations} />;
}
