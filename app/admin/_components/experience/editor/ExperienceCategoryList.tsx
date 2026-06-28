"use client";

import { Compass, ArrowUp, ArrowDown } from "lucide-react";
import type {
  AdminExperienceCategory,
  AdminExperienceItem,
} from "@/app/admin/_components/experience/admin-experience-shared";

type ExperienceCategoryListProps = {
  activeCategoryId: string;
  activeItemId: string;
  categories: AdminExperienceCategory[];
  items: AdminExperienceItem[];
  onAddItem: () => void;
  onCategorySelect: (categoryId: string) => void;
  onItemSelect: (itemId: string) => void;
  onToggleCategory: (categoryId: string) => void;
  onToggleItem: (itemId: string) => void;
  onMoveItem: (itemId: string, direction: "up" | "down") => void;
};

export function ExperienceCategoryList({
  activeCategoryId,
  activeItemId,
  categories,
  items,
  onAddItem,
  onCategorySelect,
  onItemSelect,
  onToggleCategory,
  onToggleItem,
  onMoveItem,
}: ExperienceCategoryListProps) {
  const activeCategoryItems = items.filter((item) => item.categoryId === activeCategoryId);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div className="border-b border-gray-50 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#8B6F47]" />
          <h2 className="font-extrabold text-gray-900 text-sm">카테고리 및 아이템 선택</h2>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">카테고리 섹션 선택</label>
          <div className="grid grid-cols-2 gap-1.5">
            {categories.map((category, index) => {
              const isActive = activeCategoryId === category.id;
              return (
                <div
                  key={category.id}
                  className={`rounded-xl border transition-all flex flex-col p-3 gap-2 relative ${isActive ? "bg-amber-50/40 border-[#8B6F47] shadow-sm" : "bg-gray-50/50 border-transparent hover:border-gray-200"
                    }`}
                >
                  <div onClick={() => onCategorySelect(category.id)} className="cursor-pointer flex-1 min-w-0">
                    <span className="text-[8px] text-gray-400 block mb-0.5">Section {String(index + 1).padStart(2, "0")}</span>
                    <h4 className="text-[10px] font-bold text-gray-800 truncate">{category.titleKo}</h4>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100/60 pt-1.5 mt-0.5">
                    <span className="text-[8px] font-bold text-[#8B6F47]">{category.isVisible ? "노출 ON" : "숨김 OFF"}</span>
                    <button
                      type="button"
                      onClick={() => onToggleCategory(category.id)}
                      className={`inline-flex h-5.5 w-10 shrink-0 items-center rounded-full p-0.5 transition-all ${category.isVisible ? "bg-[#8B6F47]" : "bg-gray-300"}`}
                    >
                      <span className={`size-4.5 rounded-full bg-white shadow-sm transition-transform ${category.isVisible ? "translate-x-4.5" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-gray-50">
          <div className="flex items-center justify-between gap-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">경험 아이템 목록</label>
            <button
              type="button"
              onClick={onAddItem}
              className="rounded-full border border-[#8B6F47]/20 bg-[#8B6F47]/8 px-3 py-1 text-[10px] font-bold text-[#8B6F47] transition-all hover:bg-[#8B6F47]/12"
            >
              + 아이템 추가
            </button>
          </div>
          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
            {activeCategoryItems.map((item, idx) => {
              const isActive = activeItemId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onItemSelect(item.id)}
                  className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden ${isActive ? "bg-white border-[#8B6F47] shadow-md ring-1 ring-[#8B6F47]/10" : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                      {item.imageUrl ? (
                        <img className="w-full h-full object-cover" alt={item.titleKo} src={item.imageUrl} />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-gray-900 truncate">{item.titleKo}</h4>
                      <p className="text-[9px] text-gray-400 truncate mt-0.5">{item.descriptionKo}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 pl-1">
                    <div className="flex flex-col gap-1 shrink-0 mr-1">
                      <button onClick={(e) => { e.stopPropagation(); onMoveItem(item.id, "up"); }} disabled={idx === 0} className="p-1 rounded bg-gray-50 border border-gray-100 transition-colors hover:bg-[#8B6F47]/10 hover:border-[#8B6F47]/20 text-gray-500 hover:text-[#8B6F47] disabled:opacity-30">
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); onMoveItem(item.id, "down"); }} disabled={idx === activeCategoryItems.length - 1} className="p-1 rounded bg-gray-50 border border-gray-100 transition-colors hover:bg-[#8B6F47]/10 hover:border-[#8B6F47]/20 text-gray-500 hover:text-[#8B6F47] disabled:opacity-30">
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onToggleItem(item.id); }}
                      className={`inline-flex h-5.5 w-10 shrink-0 items-center rounded-full p-0.5 transition-all ${item.isVisible ? "bg-[#8B6F47]" : "bg-gray-300"}`}
                    >
                      <span className={`size-4.5 rounded-full bg-white shadow-sm transition-transform ${item.isVisible ? "translate-x-4.5" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
