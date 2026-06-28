"use client";

import { LogOut, Save } from "lucide-react";
import { ADMIN_SAVE_REQUEST_EVENT } from "@/app/admin/_components/save/admin-save-events";

export function AdminHeaderActions() {
  function handleSaveClick() {
    if (typeof window === "undefined") {
      return;
    }

    window.dispatchEvent(new CustomEvent(ADMIN_SAVE_REQUEST_EVENT));
  }

  return (
    <div className="flex flex-shrink-0 items-center gap-2 md:gap-4">
      <button
        type="button"
        onClick={handleSaveClick}
        className="inline-flex items-center gap-1 rounded-full bg-[#8b6f47] px-3 py-2 text-[11px] font-bold text-white shadow-md shadow-amber-900/5 transition-all duration-200 cursor-pointer hover:bg-[#705835] active:scale-[0.98] md:gap-1.5 md:px-5 md:text-xs"
      >
        <Save className="h-3 w-3" strokeWidth={2.2} />
        <span className="whitespace-nowrap">변경 사항 저장</span>
      </button>

      <a
        href="/admin/logout"
        className="rounded-full p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-50 hover:text-red-500"
        title="로그아웃"
        aria-label="로그아웃"
      >
        <LogOut className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </a>
    </div>
  );
}
