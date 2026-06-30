import { redirect } from "next/navigation";
import { AdminHeader } from "@/app/admin/_components/header/AdminHeader";
import { AdminHotelsEditor } from "@/app/admin/_components/hotels/AdminHotelsEditor";
import { AdminTopNav } from "@/app/admin/_components/navigation/AdminTopNav";
import { getAdminSession } from "@/lib/auth/admin-session";
import { ADMIN_PUBLIC_LOGIN_PATH } from "@/lib/admin-routes";
import { fetchAdminHotelBranches } from "@/lib/server/admin-hotel-branches";

export default async function AdminHotelsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect(ADMIN_PUBLIC_LOGIN_PATH);
  }

  const branches = await fetchAdminHotelBranches();

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-[#f7f4ee] px-4 py-6 md:px-8 md:py-7">
        <div className="mx-auto max-w-[1600px]">
          <AdminTopNav />
          <div className="mt-6">
            <AdminHotelsEditor initialBranches={branches} />
          </div>
        </div>
      </main>
    </>
  );
}
