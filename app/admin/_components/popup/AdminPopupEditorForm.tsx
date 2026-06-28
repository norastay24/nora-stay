"use client";

import { ImagePlus, MessageSquareMore } from "lucide-react";
import type { ReactNode } from "react";
import {
  adminPopupTargetPageOptions,
  type AdminPopupSettings,
  type AdminPopupTargetPage,
} from "@/app/admin/_components/popup/admin-popup-shared";

type AdminPopupEditorFormProps = {
  imageUploadPending: boolean;
  settings: AdminPopupSettings;
  statusMessage: string;
  onFieldChange: <K extends keyof AdminPopupSettings>(
    field: K,
    value: AdminPopupSettings[K],
  ) => void;
  onTargetPageToggle: (targetPage: AdminPopupTargetPage) => void;
  onUploadImage: (file: File) => void;
};

export function AdminPopupEditorForm({
  imageUploadPending,
  settings,
  statusMessage,
  onFieldChange,
  onTargetPageToggle,
  onUploadImage,
}: AdminPopupEditorFormProps) {
  return (
    <section className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-gray-900">
            <MessageSquareMore className="h-4 w-4 text-[#8B6F47]" />
            글로벌 이벤트 팝업창 설정
          </h3>
          <p className="mt-1 text-[10px] text-gray-400">
            ※ NORA STAY 사이트 방문자에게 노출할 모달 팝업창의 이미지, 링크, 문구 및 활성화 여부를 실시간 제어합니다.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-2">
          <span className="text-xs font-bold text-gray-700">팝업 노출 여부</span>
          <button
            type="button"
            onClick={() => onFieldChange("isVisible", !settings.isVisible)}
            className={`inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-sm transition-all outline-none ${settings.isVisible ? "bg-[#8B6F47]" : "bg-gray-300"}`}
          >
            <span className={`block size-4 rounded-full bg-white transition-transform ${settings.isVisible ? "translate-x-[calc(100%-2px)]" : "translate-x-0"}`} />
          </button>
          <span className={`text-[10px] font-bold ${settings.isVisible ? "text-emerald-600" : "text-gray-400"}`}>
            {settings.isVisible ? "노출중" : "숨김"}
          </span>
        </div>
      </div>

      {/* Main Grid Fields */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="팝업창 타이틀 (국문)">
            <input
              value={settings.titleKo}
              onChange={(e) => onFieldChange("titleKo", e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-xs text-gray-800 transition-colors focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            />
          </Field>
          <Field label="팝업창 타이틀 (영문)">
            <input
              value={settings.titleEn}
              onChange={(e) => onFieldChange("titleEn", e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-xs text-gray-800 transition-colors focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            />
          </Field>
          <Field label="팝업창 설명 (국문)">
            <textarea
              rows={4}
              value={settings.descriptionKo}
              onChange={(e) => onFieldChange("descriptionKo", e.target.value)}
              className="w-full resize-none rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-xs text-gray-800 transition-colors focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            />
          </Field>
          <Field label="팝업창 설명 (영문)">
            <textarea
              rows={4}
              value={settings.descriptionEn}
              onChange={(e) => onFieldChange("descriptionEn", e.target.value)}
              className="w-full resize-none rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-xs text-gray-800 transition-colors focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            />
          </Field>
        </div>

        <div className="space-y-4">
          <Field label="이동 버튼 문구 (국문)">
            <input
              value={settings.buttonLabelKo}
              onChange={(e) => onFieldChange("buttonLabelKo", e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-xs text-gray-800 transition-colors focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            />
          </Field>
          <Field label="이동 버튼 문구 (영문)">
            <input
              value={settings.buttonLabelEn}
              onChange={(e) => onFieldChange("buttonLabelEn", e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-xs text-gray-800 transition-colors focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            />
          </Field>
          <Field label="클릭 시 이동할 링크 URL">
            <input
              value={settings.linkUrl}
              onChange={(e) => onFieldChange("linkUrl", e.target.value)}
              className="w-full rounded-xl border border-amber-100 bg-amber-50/40 px-4 py-2.5 text-xs font-semibold text-blue-600 transition-colors focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            />
          </Field>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700">노출할 타겟 페이지 설정 (중복 선택 가능)</label>
            <div className="grid grid-cols-1 gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-3 sm:grid-cols-3">
              {adminPopupTargetPageOptions.map((option) => {
                const checked = settings.targetPages.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border border-gray-100 bg-white p-2 transition-all hover:border-[#8B6F47] ${checked ? "border-[#8B6F47]" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onTargetPageToggle(option.id)}
                      className="rounded border-gray-300 text-[#8B6F47] focus:ring-[#8B6F47]"
                    />
                    <span className="text-[10px] font-bold text-gray-700">
                      {option.label} <span className="text-gray-400">({option.path})</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Area */}
      <div className="space-y-2 border-t border-gray-100 pt-6">
        <label className="text-xs font-bold text-gray-700">팝업 대표 이미지 (큼직한 미리보기 지원)</label>
        <div className="rounded-3xl border border-gray-100 bg-gray-50/50 p-4 space-y-4">
          <div className="relative h-64 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {settings.imageUrl ? (
              <img src={settings.imageUrl} alt="Popup Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-400">이미지가 없습니다.</div>
            )}
          </div>
          <div className="flex max-w-lg gap-3">
            <input
              value={settings.imageUrl}
              onChange={(e) => onFieldChange("imageUrl", e.target.value)}
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-800 transition-colors focus:border-[#8B6F47] focus:outline-none"
              placeholder="이미지 직접 주소 입력"
            />
            <input
              id="admin-popup-image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={imageUploadPending}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadImage(file);
                e.target.value = "";
              }}
            />
            <label
              htmlFor="admin-popup-image-upload"
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 transition-colors hover:border-[#8B6F47]"
            >
              {imageUploadPending ? "업로드 중..." : "파일 선택"}
            </label>
          </div>
        </div>
      </div>

      {statusMessage && <p className="text-xs font-bold text-[#8B6F47]">{statusMessage}</p>}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-700">{label}</label>
      {children}
    </div>
  );
}