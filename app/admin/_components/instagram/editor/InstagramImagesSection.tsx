"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, ImageIcon, Images, Trash2 } from "lucide-react";
import type { InstagramSlideImage } from "@/app/admin/_components/instagram/admin-instagram-shared";

type InstagramImagesSectionProps = {
  imageDraftUrl: string;
  imageUploadPending: boolean;
  images: InstagramSlideImage[];
  onAddImage: () => void;
  onImageDraftUrlChange: (value: string) => void;
  onMoveImage: (imageId: string, direction: "up" | "down") => void;
  onRemoveImage: (imageId: string) => void;
  onUploadImage: (files: File[]) => void;
};

export function InstagramImagesSection({
  imageDraftUrl,
  imageUploadPending,
  images,
  onAddImage,
  onImageDraftUrlChange,
  onMoveImage,
  onRemoveImage,
  onUploadImage,
}: InstagramImagesSectionProps) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <Images className="h-5 w-5 text-[#8B6F47]" />
          <h3 className="text-base font-extrabold text-gray-900">인스타그램 슬라이드 사진 관리</h3>
        </div>
        <span className="text-[10px] font-bold text-gray-400">{`${images.length}개 이미지`}</span>
      </div>

      {/* 입력 영역 */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 space-y-4">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8B6F47]">
          새 슬라이드 사진 추가
        </span>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-8">
            <input
              value={imageDraftUrl}
              onChange={(event) => onImageDraftUrlChange(event.target.value)}
              placeholder="추가할 이미지의 CDN 또는 스토리지 URL 입력"
              className="w-full rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-xs outline-none transition-all focus:border-[#8B6F47]"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={onAddImage}
              className="w-full rounded-xl bg-[#8B6F47] py-2.5 text-xs font-bold text-white transition-all hover:bg-[#705835]"
            >
              주소 추가
            </button>
          </div>
          <div className="md:col-span-2">
            <input
              id="insta-image-file-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={imageUploadPending}
              onChange={(event) => {
                const files = event.target.files ? Array.from(event.target.files) : [];
                if (files.length > 0) {
                  onUploadImage(files);
                }
                event.target.value = "";
              }}
            />
            <label
              htmlFor="insta-image-file-upload"
              className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl border border-dashed border-gray-300 bg-white py-2.5 text-center text-xs font-bold text-gray-600 transition-all hover:border-[#8B6F47] hover:text-[#8B6F47]"
            >
              {imageUploadPending ? "업로드 중..." : "파일 업로드"}
            </label>
          </div>
        </div>
      </div>

      {/* 이미지 리스트 */}
      <div className="max-h-[520px] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <article
              key={image.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative h-40 w-full overflow-hidden bg-gray-50">
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={image.label}
                    fill
                    unoptimized
                    sizes="(max-width: 1279px) 100vw, 33vw"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-300">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
                <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                  {image.label}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 bg-gray-50/50 p-3">
                <span className="flex-1 truncate font-mono text-[10px] text-gray-500" title={image.url}>
                  {image.url}
                </span>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onMoveImage(image.id, "up")}
                    disabled={index === 0}
                    className="rounded-lg border border-gray-100 bg-white p-1.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-white"
                    title="앞으로 이동"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveImage(image.id, "down")}
                    disabled={index === images.length - 1}
                    className="rounded-lg border border-gray-100 bg-white p-1.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-white"
                    title="뒤로 이동"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveImage(image.id)}
                    className="rounded-lg border border-gray-100 bg-white p-1.5 text-red-500 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-700"
                    title="삭제"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}