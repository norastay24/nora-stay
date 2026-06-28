"use client";

import type { AdminPopupSettings } from "@/app/admin/_components/popup/admin-popup-shared";
import { AdminPopupEditorForm } from "@/app/admin/_components/popup/AdminPopupEditorForm";
import { useAdminPopupEditor } from "@/app/admin/_components/popup/useAdminPopupEditor";
import { AdminSaveDialog } from "@/app/admin/_components/save/AdminSaveDialog";

type AdminPopupEditorProps = {
  initialSettings: AdminPopupSettings;
};

export function AdminPopupEditor({ initialSettings }: AdminPopupEditorProps) {
  const popupEditor = useAdminPopupEditor(initialSettings);

  return (
    <div className="mx-auto max-w-[1200px]">
      <AdminSaveDialog
        confirmOpen={popupEditor.saveConfirmOpen}
        isPending={popupEditor.isPending}
        resultMessage={popupEditor.saveResultMessage}
        resultOpen={popupEditor.saveResultOpen}
        resultVariant={popupEditor.saveResultVariant}
        onCancelConfirm={popupEditor.closeSaveConfirm}
        onCloseResult={popupEditor.closeSaveResult}
        onConfirm={() => {
          popupEditor.closeSaveConfirm();
          popupEditor.handleSaveRequestAction();
        }}
      />

      <AdminPopupEditorForm
        imageUploadPending={popupEditor.imageUploadPending}
        settings={popupEditor.settings}
        statusMessage={popupEditor.statusMessage}
        onFieldChange={popupEditor.updateField}
        onTargetPageToggle={popupEditor.toggleTargetPage}
        onUploadImage={(file) => {
          void popupEditor.handleUploadImage(file);
        }}
      />
    </div>
  );
}
