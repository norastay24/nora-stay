import { AdminGarosugilEditor } from "@/app/admin/_components/garosugil/AdminGarosugilEditor";
import { fetchAdminLocationContent } from "@/lib/server/admin-location-content";

type AdminLocationEditorPanelProps = {
  locationSlug: string;
};

export async function AdminLocationEditorPanel({
  locationSlug,
}: AdminLocationEditorPanelProps) {
  const initialDraft = await fetchAdminLocationContent(locationSlug);

  return (
    <AdminGarosugilEditor
      key={locationSlug}
      initialDraft={initialDraft}
      locationSlug={locationSlug}
    />
  );
}
