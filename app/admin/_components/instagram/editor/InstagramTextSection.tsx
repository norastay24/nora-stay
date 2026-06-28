"use client";

import { PenLine } from "lucide-react";
import type { InstagramDraft } from "@/app/admin/_components/instagram/admin-instagram-shared";

type InstagramTextSectionProps = {
  draft: InstagramDraft;
  onFieldChange: <K extends keyof InstagramDraft>(field: K, value: InstagramDraft[K]) => void;
};

export function InstagramTextSection({
  draft,
  onFieldChange,
}: InstagramTextSectionProps) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
        <PenLine className="h-5 w-5 text-[#8B6F47]" />
        <h3 className="text-base font-extrabold text-gray-900">인스타그램 텍스트 정보 편집</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">
            인스타그램 계정명 타이틀 (검은색 큰 글씨)
          </label>
          <input
            value={draft.campaignId}
            onChange={(e) => onFieldChange("campaignId", e.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs font-bold transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            placeholder="예: @norastay_official"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-gray-50 pt-4 mt-2 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-bold text-gray-700">
              <span className="text-amber-500">💬</span>
              <span>푸터 카카오톡 바로가기 링크</span>
            </label>
            <input
              value={draft.buddyLinkKo}
              onChange={(e) => onFieldChange("buddyLinkKo", e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
              placeholder="카카오톡 채널 주소 입력"
            />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-bold text-gray-700">
              <span className="text-pink-500">📸</span>
              <span>푸터 인스타그램 바로가기 링크</span>
            </label>
            <input
              value={draft.buddyLinkEn}
              onChange={(e) => onFieldChange("buddyLinkEn", e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
              placeholder="인스타그램 프로필 주소 입력"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">하단 바로가기 문구 (국문)</label>
            <input
              value={draft.footerKo}
              onChange={(e) => onFieldChange("footerKo", e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
              placeholder="하단 안내 문구 (국문)"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">하단 바로가기 문구 (영문)</label>
            <input
              value={draft.footerEn}
              onChange={(e) => onFieldChange("footerEn", e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
              placeholder="하단 안내 문구 (영문)"
            />
          </div>
        </div>
      </div>
    </section>
  );
}