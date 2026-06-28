"use client";

import { Plus, Trash2, Eye, EyeOff, Settings } from "lucide-react";
import {
  hotelThemeColorMap,
  type AdminHotelBranch,
} from "@/app/admin/_components/hotels/admin-hotels-shared";

type AdminHotelsSidebarProps = {
  branches: AdminHotelBranch[];
  activeBranchId: string;
  onSelectBranch: (branchId: string) => void;
  onAddBranch: () => void;
  onDeleteBranch: (branchId: string) => void;
};

export function AdminHotelsSidebar({
  branches,
  activeBranchId,
  onSelectBranch,
  onAddBranch,
  onDeleteBranch,
}: AdminHotelsSidebarProps) {
  const visibleCount = branches.filter((branch) => branch.isVisible).length;

  return (
    <aside className="w-full max-w-[400px] space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">전체 지점</span>
          <span className="text-xl font-extrabold text-gray-900">{branches.length}개 지점</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">활성 노출</span>
          <span className="text-xl font-extrabold text-emerald-600">{visibleCount}개 지점</span>
        </div>
      </div>

      {/* 지점 목록 관리 */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-400" />
            <h2 className="font-extrabold text-gray-900 text-sm">지점 목록 관리</h2>
          </div>
          <button
            type="button"
            onClick={onAddBranch}
            className="bg-amber-50 hover:bg-amber-100/80 text-[#8B6F47] text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition-all"
          >
            <Plus className="w-3 h-3" />
            추가
          </button>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {branches.map((branch) => {
            const isActive = branch.id === activeBranchId;
            const themeColor = hotelThemeColorMap[branch.colorThemes[0] ?? "Nora Brown"];

            return (
              <div
                key={branch.id}
                onClick={() => onSelectBranch(branch.id)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden bg-white 
                  ${isActive
                    ? "border-[#8B6F47] shadow-md ring-1 ring-[#8B6F47]/20"
                    : "border-gray-100 hover:border-gray-200 hover:shadow-sm"}`}
              >
                {/* 테마 컬러 사이드 바 */}
                <div className="absolute top-0 left-0 bottom-0 w-1.5" style={{ backgroundColor: themeColor }} />

                <div className="pl-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-xs text-gray-900 truncate">{branch.name || "지점명 미입력"}</h3>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDeleteBranch(branch.id); }}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      title="지점 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate mt-1">{branch.address || "주소를 입력해 주세요."}</p>
                </div>

                {/* 상태 뱃지 영역 */}
                <div className="pl-2 flex items-center gap-1.5 pt-1 border-t border-gray-50 text-[9px] font-bold">
                  <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${branch.isVisible ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                    {branch.isVisible ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                    {branch.isVisible ? "노출중" : "노출안함"}
                  </span>

                  <span className={`px-2 py-0.5 rounded-full ${branch.isFeatured ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                    {branch.isFeatured ? "영업중" : "준비중"}
                  </span>

                  {branch.featureBadges.map((badge, idx) => (
                    <span
                      key={`${branch.id}-badge-${idx}`}
                      className="bg-[#fff4e2] text-[#cf8a22] px-2 py-0.5 rounded-full"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
