"use client";

import type { AdminExperienceCategory } from "@/app/admin/_components/experience/admin-experience-shared";

type ExperienceCategoryFormProps = {
  category: AdminExperienceCategory | null;
  onChange: <K extends keyof AdminExperienceCategory>(
    field: K,
    value: AdminExperienceCategory[K],
  ) => void;
};

export function ExperienceCategoryForm({
  category,
  onChange,
}: ExperienceCategoryFormProps) {
  if (!category) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-6 sm:p-8">
      <div className="border-b border-gray-100 pb-4">
        <p className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#8B6F47]">
          Section {String(category.sortOrder).padStart(2, "0")}
        </p>
        <h3 className="text-base font-extrabold text-gray-900">
          카테고리 정보 편집 ({category.titleKo || "새 카테고리"})
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">카테고리 탭명 (국문)</label>
          <input
            value={category.titleKo}
            onChange={(e) => onChange("titleKo", e.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            placeholder="탭에 노출될 카테고리명 (국문)"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">카테고리 탭명 (영문)</label>
          <input
            value={category.titleEn}
            onChange={(e) => onChange("titleEn", e.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            placeholder="탭에 노출될 카테고리명 (영문)"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">소제목 (국문)</label>
          <input
            value={category.subtitleKo}
            onChange={(e) => onChange("subtitleKo", e.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            placeholder="소제목 (국문)"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">소제목 (영문)</label>
          <input
            value={category.subtitleEn}
            onChange={(e) => onChange("subtitleEn", e.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            placeholder="소제목 (영문)"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-gray-700">메인 설명 문구 (국문)</label>
          <input
            value={category.descriptionKo}
            onChange={(e) => onChange("descriptionKo", e.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            placeholder="메인 설명 문구 (국문)"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-gray-700">메인 설명 문구 (영문)</label>
          <input
            value={category.descriptionEn}
            onChange={(e) => onChange("descriptionEn", e.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            placeholder="메인 설명 문구 (영문)"
          />
        </div>
      </div>
    </section>
  );
}