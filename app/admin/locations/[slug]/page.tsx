import { notFound } from "next/navigation";
import { AdminLocationEditorPageContent } from "@/app/admin/_components/locations/AdminLocationEditorPageContent";
import {
  fallbackHotelBranches,
  fetchAdminHotelBranches,
} from "@/lib/server/admin-hotel-branches";

type AdminLocationPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminLocationPage({ params }: AdminLocationPageProps) {
  const { slug } = await params;
  const branches = await fetchAdminHotelBranches();
  const locationBranches = (branches.length > 0 ? branches : fallbackHotelBranches).filter(
    (branch) => branch.slug,
  );
  const matchedBranch = locationBranches.find((branch) => branch.slug === slug);

  if (!matchedBranch) {
    notFound();
  }

  return <AdminLocationEditorPageContent locationSlug={slug} />;
}
