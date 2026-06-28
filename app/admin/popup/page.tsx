import { redirect } from "next/navigation";
import { AdminPopupEditor } from "@/app/admin/_components/popup/AdminPopupEditor";
import { AdminHeader } from "@/app/admin/_components/header/AdminHeader";
import { AdminTopNav } from "@/app/admin/_components/navigation/AdminTopNav";
import { getAdminSession } from "@/lib/auth/admin-session";
import { fetchAdminPopupSettings } from "@/lib/server/admin-popup-settings";

export default async function AdminPopupPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  const settings = await fetchAdminPopupSettings();

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-[#f7f4ee] px-4 py-6 md:px-8 md:py-7">
        <div className="mx-auto max-w-[1600px]">
          <AdminTopNav />
          <div className="mt-6">
            <AdminPopupEditor initialSettings={settings} />
          </div>
        </div>
      </main>
    </>
  );
}
