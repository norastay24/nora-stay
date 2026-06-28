import { redirect } from "next/navigation";
import { AdminHeader } from "@/app/admin/_components/header/AdminHeader";
import { AdminTopNav } from "@/app/admin/_components/navigation/AdminTopNav";
import { AdminTranslationsEditor } from "@/app/admin/_components/translations/AdminTranslationsEditor";
import { getAdminSession } from "@/lib/auth/admin-session";
import { fetchAdminTranslationEntries } from "@/lib/server/admin-translations";

export default async function AdminTranslationsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  const initialEntries = await fetchAdminTranslationEntries();

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-[#f7f4ee] px-4 py-6 md:px-8 md:py-7">
        <div className="mx-auto max-w-[1200px]">
          <AdminTopNav />
          <div className="mt-6">
            <AdminTranslationsEditor initialEntries={initialEntries} />
          </div>
        </div>
      </main>
    </>
  );
}
