import { redirect } from "next/navigation";
import { AdminHeader } from "@/app/admin/_components/header/AdminHeader";
import { AdminInstagramEditor } from "@/app/admin/_components/instagram/AdminInstagramEditor";
import { AdminTopNav } from "@/app/admin/_components/navigation/AdminTopNav";
import { getAdminSession } from "@/lib/auth/admin-session";
import { ADMIN_PUBLIC_LOGIN_PATH } from "@/lib/admin-routes";
import { fetchAdminInstagramDraft } from "@/lib/server/admin-instagram-settings";

export default async function AdminInstagramPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect(ADMIN_PUBLIC_LOGIN_PATH);
  }

  const initialDraft = await fetchAdminInstagramDraft();

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-[#f7f4ee] px-4 py-6 md:px-8 md:py-7">
        <div className="mx-auto max-w-[1600px]">
          <AdminTopNav />
          <div className="mt-6">
            <AdminInstagramEditor initialDraft={initialDraft} />
          </div>
        </div>
      </main>
    </>
  );
}
