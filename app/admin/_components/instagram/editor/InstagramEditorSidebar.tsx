"use client";

import { Info, PenLine } from "lucide-react";

export function InstagramEditorSidebar() {
  return (
    <aside className="self-start h-fit rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
        <PenLine className="h-4 w-4 text-[#8B6F47]" />
        <h2 className="text-sm font-extrabold text-gray-900">인스타그램 편집 안내</h2>
      </div>
      <p className="text-xs leading-relaxed text-gray-500">
        우측의 편집 패널에서 메인 페이지 하단에 노출되는 인스타그램 섹션의{" "}
        <strong>계정명 타이틀</strong>, <strong>하단 안내 문구</strong>, 그리고{" "}
        <strong>슬라이더에 들어갈 고화질 이미지 리스트</strong>를 실시간으로 간편하게 수정할 수 있습니다.
      </p>


      <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 text-[10px] leading-normal text-gray-500">
        <span className="mb-1 block font-bold text-[#8B6F47]">
          ※ 레이아웃 보존 규칙
        </span>
        인스타그램 사진 슬라이더의 물리적 정렬, 가속 스크롤 및 모바일 반응형 그리드 등의 레이아웃 디자인은 그대로 안전하게 유지됩니다.
      </div>
    </aside>
  );
}
