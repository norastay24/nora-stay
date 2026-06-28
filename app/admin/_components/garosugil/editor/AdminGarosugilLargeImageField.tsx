"use client";

import Image from "next/image";
import { Field } from "@/app/admin/_components/garosugil/editor/AdminGarosugilFormPrimitives";

type AdminGarosugilLargeImageFieldProps = {
  fileInputId: string;
  imageUrl: string;
  imageUploadPending?: boolean;
  label: string;
  previewAlt: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => void;
};

export function AdminGarosugilLargeImageField({
  fileInputId,
  imageUrl,
  imageUploadPending = false,
  label,
  previewAlt,
  onChange,
  onUpload,
}: AdminGarosugilLargeImageFieldProps) {
  return (
    <div className="space-y-2 border-t border-gray-100 pt-6">
      <Field label={label}>
        <div className="space-y-4 rounded-3xl border border-gray-100 bg-gray-50/50 p-4">
          <div className="relative h-64 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={previewAlt}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                이미지가 없습니다.
              </div>
            )}
          </div>

          <div className="flex max-w-lg gap-3">
            <input
              value={imageUrl}
              onChange={(event) => onChange(event.target.value)}
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-800 transition-colors focus:border-[#8B6F47] focus:outline-none"
              placeholder="이미지 직접 주소 입력"
            />
            <input
              id={fileInputId}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={imageUploadPending}
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (!file) {
                  return;
                }

                onUpload(file);
                event.target.value = "";
              }}
            />
            <label
              htmlFor={fileInputId}
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 transition-colors hover:border-[#8B6F47]"
            >
              {imageUploadPending ? "업로드 중..." : "파일 선택"}
            </label>
          </div>
        </div>
      </Field>
    </div>
  );
}
