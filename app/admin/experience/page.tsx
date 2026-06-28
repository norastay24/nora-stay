import { redirect } from "next/navigation";
import { AdminHeader } from "@/app/admin/_components/header/AdminHeader";
import { AdminExperienceEditor } from "@/app/admin/_components/experience/AdminExperienceEditor";
import { AdminTopNav } from "@/app/admin/_components/navigation/AdminTopNav";
import { getAdminSession } from "@/lib/auth/admin-session";
import { fetchAdminExperienceContent } from "@/lib/server/admin-experience-content";

export default async function AdminExperiencePage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  const content = await fetchAdminExperienceContent();

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-[#f7f4ee] px-4 py-6 md:px-8 md:py-7">
        <div className="mx-auto max-w-[1600px]">
          <AdminTopNav />
          <div className="mt-6">
            <AdminExperienceEditor initialContent={content} />
          </div>
        </div>
      </main>
    </>
  );
}
