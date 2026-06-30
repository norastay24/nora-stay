import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/app/admin/_components/header/AdminHeader";
import { AdminLocationEditorPanel } from "@/app/admin/_components/locations/AdminLocationEditorPanel";
import { AdminTopNav } from "@/app/admin/_components/navigation/AdminTopNav";
import { getAdminSession } from "@/lib/auth/admin-session";
import { ADMIN_PUBLIC_LOGIN_PATH, buildAdminPublicPath } from "@/lib/admin-routes";
import { fetchAdminHotelBranches } from "@/lib/server/admin-hotel-branches";

type AdminLocationsPageProps = {
  searchParams: Promise<{
    slug?: string;
  }>;
};

export default async function AdminLocationsPage({
  searchParams,
}: AdminLocationsPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect(ADMIN_PUBLIC_LOGIN_PATH);
  }

  const resolvedSearchParams = await searchParams;
  const branches = await fetchAdminHotelBranches();
  const locationBranches = branches
    .filter((branch) => branch.slug)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const fallbackSlug = locationBranches[0]?.slug ?? "garosugil";
  const selectedSlug = resolvedSearchParams.slug ?? fallbackSlug;
  const activeBranch = locationBranches.find((branch) => branch.slug === selectedSlug);

  if (!activeBranch && locationBranches.length > 0) {
    redirect(`${buildAdminPublicPath("/admin/locations")}?slug=${fallbackSlug}`);
  }

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-[#f7f4ee] px-4 py-6 md:px-8 md:py-7">
        <div className="mx-auto max-w-[1200px]">
          <AdminTopNav />

          <section className="mt-6 rounded-[28px] border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-sm font-extrabold text-gray-900">현재 호텔 지점</h2>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {locationBranches.map((branch) => {
                const isActive = branch.slug === activeBranch?.slug;

                return (
                  <Link
                    key={branch.slug}
                    href={`${buildAdminPublicPath("/admin/locations")}?slug=${branch.slug}`}
                    className={[
                      "min-w-fit rounded-full border px-4 py-2 text-[12px] font-bold tracking-[-0.03em] transition-all duration-200",
                      isActive
                        ? "border-[#9f7b47] bg-[#9f7b47] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                        : "border-[#ece7de] bg-[#faf8f4] text-[#69758a] hover:border-[#d9c9ae] hover:text-[#2f2418]",
                    ].join(" ")}
                  >
                    {branch.name || branch.slug}
                  </Link>
                );
              })}
            </div>
          </section>

          <div className="mt-6">
            <AdminLocationEditorPanel locationSlug={activeBranch?.slug ?? fallbackSlug} />
          </div>
        </div>
      </main>
    </>
  );
}
