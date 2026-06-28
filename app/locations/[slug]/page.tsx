import { notFound } from "next/navigation";
import { LocationLandingPageContent } from "@/app/locations/_components/LocationLandingPageContent";
import {
  fallbackHotelBranches,
  fetchAdminHotelBranches,
} from "@/lib/server/admin-hotel-branches";

function normalizePreviewLink(previewLink: string) {
  const trimmed = previewLink.trim();

  if (!trimmed.startsWith("/")) {
    return "";
  }

  const normalized = trimmed.replace(/\/+$/, "");

  if (normalized.startsWith("/locations/")) {
    return normalized.slice("/locations/".length);
  }

  return normalized.slice(1);
}

type LocationPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const branches = await fetchAdminHotelBranches();
  const locationBranches = (branches.length > 0 ? branches : fallbackHotelBranches).filter(
    (branch) => branch.slug,
  );
  const matchedBranch = locationBranches.find(
    (branch) => branch.slug === slug || normalizePreviewLink(branch.previewLink) === slug,
  );

  if (!matchedBranch || !matchedBranch.isVisible) {
    notFound();
  }

  return <LocationLandingPageContent locationSlug={matchedBranch.slug} />;
}
