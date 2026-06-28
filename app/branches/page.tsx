import { BranchesPageShell } from "@/app/branches/_components/BranchesPageShell";
import { buildBranchItems } from "@/app/branches/_components/branches.data";
import { getRequestLocale } from "@/lib/i18n-server";
import { fetchAdminHotelBranches } from "@/lib/server/admin-hotel-branches";
import { fetchAdminTranslationMap } from "@/lib/server/admin-translations";

export default async function BranchesPage() {
  const locale = await getRequestLocale();
  const [hotelBranches, translations] = await Promise.all([
    fetchAdminHotelBranches(),
    fetchAdminTranslationMap(),
  ]);
  const branches = buildBranchItems(hotelBranches);

  return (
    <main className="flex-1 bg-[#f8f5ef]">
      <BranchesPageShell branches={branches} locale={locale} translations={translations} />
    </main>
  );
}
