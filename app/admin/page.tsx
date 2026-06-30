import { redirect } from "next/navigation";
import { AdminHeader } from "@/app/admin/_components/header/AdminHeader";
import { AdminHomeSettingsEditor } from "@/app/admin/_components/home/AdminHomeSettingsEditor";
import { AdminTopNav } from "@/app/admin/_components/navigation/AdminTopNav";
import { getAdminSession } from "@/lib/auth/admin-session";
import { ADMIN_PUBLIC_LOGIN_PATH } from "@/lib/admin-routes";
import { fetchAdminHomeSettings } from "@/lib/server/admin-home-settings";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect(ADMIN_PUBLIC_LOGIN_PATH);
  }

  const initialSettings = await fetchAdminHomeSettings();

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-[#f7f4ee] px-4 py-6 md:px-8 md:py-7">
        <div className="mx-auto max-w-[1200px]">
          <AdminTopNav />
          <div className="mt-8">
            <AdminHomeSettingsEditor initialSettings={initialSettings} />
          </div>
        </div>
      </main>
    </>
  );
}
