import { redirect } from "next/navigation";
import { AdminHeader } from "@/app/admin/_components/header/AdminHeader";
import { AdminLocationEditorPanel } from "@/app/admin/_components/locations/AdminLocationEditorPanel";
import { AdminTopNav } from "@/app/admin/_components/navigation/AdminTopNav";
import { getAdminSession } from "@/lib/auth/admin-session";

type AdminLocationEditorPageContentProps = {
  locationSlug: string;
};

export async function AdminLocationEditorPageContent({
  locationSlug,
}: AdminLocationEditorPageContentProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-[#f7f4ee] px-4 py-6 md:px-8 md:py-7">
        <div className="mx-auto max-w-[1600px]">
          <AdminTopNav />
          <div className="mt-6">
            <AdminLocationEditorPanel locationSlug={locationSlug} />
          </div>
        </div>
      </main>
    </>
  );
}
