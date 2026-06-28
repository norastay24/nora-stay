"use client";

import { Info, Link as LinkIcon, PenLine } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import {
  createDefaultAdminHomeSettings,
  type AdminHomeSettings,
} from "@/app/admin/_components/home/admin-home-shared";
import { AdminSaveDialog } from "@/app/admin/_components/save/AdminSaveDialog";
import { ADMIN_SAVE_REQUEST_EVENT } from "@/app/admin/_components/save/admin-save-events";

type AdminHomeSettingsEditorProps = {
  initialSettings: AdminHomeSettings;
};

export function AdminHomeSettingsEditor({ initialSettings }: AdminHomeSettingsEditorProps) {
  const [settings, setSettings] = useState<AdminHomeSettings>(() => ({
    ...createDefaultAdminHomeSettings(),
    ...initialSettings,
  }));
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [saveResultOpen, setSaveResultOpen] = useState(false);
  const [saveResultMessage, setSaveResultMessage] = useState("");
  const [saveResultVariant, setSaveResultVariant] = useState<"success" | "error">("success");
  const [isPending, startTransition] = useTransition();

  function handleFieldChange<K extends keyof AdminHomeSettings>(
    field: K,
    value: AdminHomeSettings[K],
  ) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  function openSaveResult(message: string, variant: "success" | "error") {
    setSaveResultMessage(message);
    setSaveResultVariant(variant);
    setSaveResultOpen(true);
  }

  function getValidatedSettings() {
    return {
      bookingUrl: settings.bookingUrl.trim() || "#",
    };
  }

  function handleSaveConfirm() {
    setSaveConfirmOpen(false);

    startTransition(() => {
      void (async () => {
        const validatedSettings = getValidatedSettings();
        const response = await fetch("/api/admin/home-settings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ settings: validatedSettings }),
        });

        if (!response.ok) {
          openSaveResult("저장에 실패했습니다.", "error");
          return;
        }

        setSettings(validatedSettings);
        openSaveResult("저장이 완료되었습니다.", "success");
      })();
    });
  }

  useEffect(() => {
    const handleSaveRequest = () => {
      setSaveConfirmOpen(true);
    };

    window.addEventListener(ADMIN_SAVE_REQUEST_EVENT, handleSaveRequest);

    return () => {
      window.removeEventListener(ADMIN_SAVE_REQUEST_EVENT, handleSaveRequest);
    };
  }, []);

  return (
    <div className="mx-auto grid max-w-[1200px] gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <AdminSaveDialog
        confirmOpen={saveConfirmOpen}
        isPending={isPending}
        resultMessage={saveResultMessage}
        resultOpen={saveResultOpen}
        resultVariant={saveResultVariant}
        onCancelConfirm={() => setSaveConfirmOpen(false)}
        onCloseResult={() => setSaveResultOpen(false)}
        onConfirm={handleSaveConfirm}
      />

      <aside className="h-fit self-start space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
          <PenLine className="h-4 w-4 text-[#8B6F47]" />
          <h2 className="text-sm font-extrabold text-gray-900">메인 홈 편집 안내</h2>
        </div>
        <p className="text-xs leading-relaxed text-gray-500">
          이 섹션에서는 메인 홈에 노출되는
          <strong> 에어비앤비 예약 버튼 링크</strong>를 관리합니다. 저장하면 히어로 버튼과
          하단 CTA 배너 버튼에 동일하게 반영됩니다.
        </p>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 text-[10px] leading-normal text-gray-500">
          <span className="mb-1 block font-bold text-[#8B6F47]">적용 범위</span>
          메인 홈 `/` 페이지의 예약 버튼 2곳에 같은 링크가 연결됩니다. 버튼 문구와 디자인은
          유지되고 링크만 변경됩니다.
        </div>
      </aside>

      <section className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <LinkIcon className="h-5 w-5 text-[#8B6F47]" />
          <h3 className="text-base font-extrabold text-gray-900">홈 예약 버튼 링크 편집</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">에어비앤비 예약 링크 URL</label>
            <input
              value={settings.bookingUrl}
              onChange={(event) => handleFieldChange("bookingUrl", event.target.value)}
              placeholder="https://www.airbnb.co.kr/rooms/..."
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs font-semibold text-blue-600 transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 text-[#8B6F47]" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-800">연결 위치</p>
                <p className="text-[11px] leading-relaxed text-gray-500">
                  홈 히어로 섹션의 `에어비앤비 숙소 예약하기` 버튼
                  <br />
                  홈 하단 CTA 배너의 `에어비앤비 숙소 예약하기` 버튼
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
