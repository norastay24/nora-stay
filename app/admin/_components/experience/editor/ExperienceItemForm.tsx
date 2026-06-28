"use client";

import type {
  AdminExperienceCategory,
  AdminExperienceItem,
} from "@/app/admin/_components/experience/admin-experience-shared";

type ExperienceItemFormProps = {
  categoryOptions: AdminExperienceCategory[];
  imageUploadPending: boolean;
  item: AdminExperienceItem | null;
  onChange: <K extends keyof AdminExperienceItem>(field: K, value: AdminExperienceItem[K]) => void;
  onUploadImage: (file: File) => void;
};

export function ExperienceItemForm({
  categoryOptions,
  imageUploadPending,
  item,
  onChange,
  onUploadImage,
}: ExperienceItemFormProps) {
  if (!item) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-gray-100 pb-4">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#8B6F47]">
          Experience Item Edit
        </span>
        <h3 className="text-base font-extrabold text-gray-900">개별 경험 아이템 편집</h3>
      </div>

      <div className="mt-6 space-y-6">
        {/* 노출 여부 스위치 */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
          <div className="space-y-1">
            <span className="block text-xs font-bold text-gray-800">이 경험 아이템 노출 여부</span>
            <p className="text-[10px] text-gray-400">비활성화 시 사용자 화면의 경험 카드 리스트에서 보이지 않게 됩니다.</p>
          </div>
          <button
            type="button"
            onClick={() => onChange("isVisible", !item.isVisible)}
            className={`inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all ${item.isVisible ? "bg-[#8B6F47]" : "bg-gray-200"
              }`}
          >
            <span
              className={`block size-4 rounded-full bg-white transition-transform ${item.isVisible ? "translate-x-[calc(100%-2px)]" : "translate-x-0"
                }`}
            />
          </button>
        </div>

        {/* 이미지 관리 */}
        <div className="space-y-3">
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            경험 대표 이미지 관리
          </label>
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <div className="h-24 w-32 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt="미리보기"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex-1 w-full space-y-2">
              <input
                value={item.imageUrl}
                onChange={(event) => onChange("imageUrl", event.target.value)}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-xs font-mono transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
                placeholder="이미지 주소"
              />
              <input
                id="experience-item-image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={imageUploadPending}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onUploadImage(file);
                  event.target.value = "";
                }}
              />
              <label
                htmlFor="experience-item-image-upload"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-[10px] font-bold text-gray-600 transition-all hover:border-[#8B6F47] hover:bg-white hover:text-[#8B6F47]"
              >
                {imageUploadPending ? "업로드 중..." : "새 이미지 파일 업로드"}
              </label>
            </div>
          </div>
        </div>

        {/* 국/영문 아이템명 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">아이템명 (국문)</label>
            <input
              value={item.titleKo}
              onChange={(event) => onChange("titleKo", event.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">아이템명 (영문)</label>
            <input
              value={item.titleEn}
              onChange={(event) => onChange("titleEn", event.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* 국/영문 설명 */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">설명글 (국문)</label>
            <textarea
              rows={3}
              value={item.descriptionKo}
              onChange={(event) => onChange("descriptionKo", event.target.value)}
              className="w-full resize-none rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs leading-relaxed transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">설명글 (영문)</label>
            <textarea
              rows={3}
              value={item.descriptionEn}
              onChange={(event) => onChange("descriptionEn", event.target.value)}
              className="w-full resize-none rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs leading-relaxed transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* 카테고리 이동 */}
        <div className="space-y-1.5 border-t border-gray-50 pt-4">
          <label className="block text-xs font-bold text-gray-700">이 아이템을 다른 카테고리로 이동</label>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={item.categoryId}
              onChange={(event) => onChange("categoryId", event.target.value)}
              className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-xs text-gray-700 transition-all focus:border-[#8B6F47] focus:bg-white focus:outline-none"
            >
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.titleKo} (Section {String(category.sortOrder).padStart(2, "0")})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-gray-400">※ 카테고리 변경 시 즉시 목록이 재구성됩니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
