"use client";

import { Sparkles } from "lucide-react"; // lucide-react가 설치되어 있다고 가정
import type { AdminExperiencePageSettings } from "@/app/admin/_components/experience/admin-experience-shared";

type ExperienceEditorSidebarProps = {
  settings: AdminExperiencePageSettings;
  onChange: <K extends keyof AdminExperiencePageSettings>(
    field: K,
    value: AdminExperiencePageSettings[K],
  ) => void;
};

export function ExperienceEditorSidebar({
  settings,
  onChange,
}: ExperienceEditorSidebarProps) {
  return (
    <aside className="space-y-5">
      <section className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
          <Sparkles className="h-4 w-4 text-[#8B6F47]" />
          <h2 className="text-xs font-extrabold text-gray-900">
            경험 페이지 상단 소개 관리
          </h2>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block space-y-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              메인 타이틀 (국문)
            </span>
            <textarea
              rows={2}
              value={settings.mainTitleKo}
              onChange={(e) => onChange("mainTitleKo", e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-xs leading-relaxed outline-none transition-all focus:border-[#8B6F47] focus:bg-white"
            />
          </label>

          <label className="block space-y-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              메인 타이틀 (영문)
            </span>
            <textarea
              rows={2}
              value={settings.mainTitleEn}
              onChange={(e) => onChange("mainTitleEn", e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-xs leading-relaxed outline-none transition-all focus:border-[#8B6F47] focus:bg-white"
            />
          </label>

          <label className="block space-y-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              설명글 (국문)
            </span>
            <textarea
              rows={3}
              value={settings.descriptionKo}
              onChange={(e) => onChange("descriptionKo", e.target.value)}
              className="w-full resize-none rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-xs leading-relaxed outline-none transition-all focus:border-[#8B6F47] focus:bg-white"
            />
          </label>

          <label className="block space-y-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              설명글 (영문)
            </span>
            <textarea
              rows={3}
              value={settings.descriptionEn}
              onChange={(e) => onChange("descriptionEn", e.target.value)}
              className="w-full resize-none rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-xs leading-relaxed outline-none transition-all focus:border-[#8B6F47] focus:bg-white"
            />
          </label>
        </div>
      </section>
    </aside>
  );
}