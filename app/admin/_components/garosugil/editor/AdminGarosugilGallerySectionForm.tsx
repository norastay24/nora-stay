"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, ImageIcon, Images, Trash2 } from "lucide-react";
import { useState } from "react";
import { createClientId } from "@/app/admin/_components/hotels/admin-hotels-shared";
import {
  ActionButton,
  Field,
  SectionCard,
  TextArea,
  TextInput,
} from "@/app/admin/_components/garosugil/editor/AdminGarosugilFormPrimitives";
import type {
  GarosugilGalleryCategory,
  GarosugilGallerySectionContent,
  GarosugilGallerySlide,
} from "@/lib/garosugil-content";

type AdminGarosugilGallerySectionFormProps = {
  gallery: GarosugilGallerySectionContent;
  onChange: (nextGallery: GarosugilGallerySectionContent) => void;
  onUploadImage: (file: File, categoryId: string, slideId: string) => void;
};

function createEmptySlide(url = ""): GarosugilGallerySlide {
  return {
    id: createClientId(),
    title: "",
    titleEn: "",
    imageSrc: url,
    imageAlt: "",
  };
}

function createEmptyCategory(): GarosugilGalleryCategory {
  return {
    id: createClientId(),
    label: "",
    labelEn: "",
    description: "",
    descriptionEn: "",
    slides: [createEmptySlide()],
  };
}

function swapItems<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [picked] = nextItems.splice(from, 1);
  nextItems.splice(to, 0, picked);
  return nextItems;
}

export function AdminGarosugilGallerySectionForm({
  gallery,
  onChange,
  onUploadImage,
}: AdminGarosugilGallerySectionFormProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(
    gallery.categories[0]?.id ?? createClientId(),
  );
  const [imageDraftUrl, setImageDraftUrl] = useState("");

  const activeCategory =
    gallery.categories.find((category) => category.id === activeCategoryId) ?? gallery.categories[0];

  function updateCategory(
    categoryId: string,
    updater: (category: GarosugilGalleryCategory) => GarosugilGalleryCategory,
  ) {
    onChange({
      ...gallery,
      categories: gallery.categories.map((category) =>
        category.id === categoryId ? updater(category) : category,
      ),
    });
  }

  function updateSlide(
    categoryId: string,
    slideId: string,
    updater: (slide: GarosugilGallerySlide) => GarosugilGallerySlide,
  ) {
    updateCategory(categoryId, (category) => ({
      ...category,
      slides: category.slides.map((slide) => (slide.id === slideId ? updater(slide) : slide)),
    }));
  }

  function removeCategory(categoryId: string) {
    const nextCategories = gallery.categories.filter((category) => category.id !== categoryId);
    onChange({
      ...gallery,
      categories: nextCategories,
    });

    if (activeCategoryId === categoryId) {
      setActiveCategoryId(nextCategories[0]?.id ?? createClientId());
    }
  }

  function handleAddSlide() {
    if (!activeCategory) {
      return;
    }

    const nextUrl = imageDraftUrl.trim();

    if (!nextUrl) {
      return;
    }

    updateCategory(activeCategory.id, (current) => ({
      ...current,
      slides: [...current.slides, createEmptySlide(nextUrl)],
    }));
    setImageDraftUrl("");
  }

  return (
    <SectionCard title="갤러리 섹션" description="카테고리별 슬라이드 이미지와 한영 문구를 관리합니다.">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="상단 문구 (KR)">
          <TextInput
            value={gallery.eyebrow}
            onChange={(value) => onChange({ ...gallery, eyebrow: value })}
          />
        </Field>
        <Field label="상단 문구 (EN)">
          <TextInput
            value={gallery.eyebrowEn ?? ""}
            onChange={(value) => onChange({ ...gallery, eyebrowEn: value })}
          />
        </Field>
        <Field label="제목 (KR)">
          <TextInput
            value={gallery.title}
            onChange={(value) => onChange({ ...gallery, title: value })}
          />
        </Field>
        <Field label="제목 (EN)">
          <TextInput
            value={gallery.titleEn ?? ""}
            onChange={(value) => onChange({ ...gallery, titleEn: value })}
          />
        </Field>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-3">
        <div className="flex flex-wrap gap-2">
          {gallery.categories.map((category) => {
            const isActive = category.id === activeCategory?.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategoryId(category.id)}
                className={[
                  "rounded-full border px-4 py-2 text-[12px] font-bold tracking-[-0.03em] transition-all duration-200",
                  isActive
                    ? "border-[#9f7b47] bg-[#9f7b47] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                    : "border-transparent bg-transparent text-[#69758a] hover:bg-[#f9fafb] hover:text-[#000]",
                ].join(" ")}
              >
                {category.label || "이름 없는 카테고리"}
              </button>
            );
          })}

          <ActionButton
            variant="subtle"
            onClick={() => {
              const nextCategory = createEmptyCategory();
              onChange({
                ...gallery,
                categories: [...gallery.categories, nextCategory],
              });
              setActiveCategoryId(nextCategory.id);
            }}
            className="border-transparent bg-transparent text-[#69758a] hover:bg-[#f9fafb] hover:text-[#000]"
          >
            카테고리 추가
          </ActionButton>
        </div>
      </div>

      {activeCategory ? (
        <section className="space-y-6 rounded-3xl border border-gray-100 bg-[#fbfcfd] p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Images className="h-5 w-5 text-[#8B6F47]" />
              <h3 className="text-base font-extrabold text-gray-900">카테고리 슬라이드 사진 관리</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-400">
                {activeCategory.slides.length}개 이미지
              </span>
              <ActionButton variant="danger" onClick={() => removeCategory(activeCategory.id)}>
                카테고리 삭제
              </ActionButton>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="카테고리명 (KR)">
              <TextInput
                value={activeCategory.label}
                onChange={(value) =>
                  updateCategory(activeCategory.id, (current) => ({ ...current, label: value }))
                }
              />
            </Field>
            <Field label="카테고리명 (EN)">
              <TextInput
                value={activeCategory.labelEn ?? ""}
                onChange={(value) =>
                  updateCategory(activeCategory.id, (current) => ({ ...current, labelEn: value }))
                }
              />
            </Field>
            <Field label="카테고리 설명 (KR)">
              <TextArea
                rows={3}
                value={activeCategory.description}
                onChange={(value) =>
                  updateCategory(activeCategory.id, (current) => ({
                    ...current,
                    description: value,
                  }))
                }
              />
            </Field>
            <Field label="카테고리 설명 (EN)">
              <TextArea
                rows={3}
                value={activeCategory.descriptionEn ?? ""}
                onChange={(value) =>
                  updateCategory(activeCategory.id, (current) => ({
                    ...current,
                    descriptionEn: value,
                  }))
                }
              />
            </Field>
          </div>

          <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8B6F47]">
              슬라이드 사진 추가
            </span>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
              <div className="md:col-span-8">
                <input
                  value={imageDraftUrl}
                  onChange={(event) => setImageDraftUrl(event.target.value)}
                  placeholder="추가할 이미지의 CDN 또는 스토리지 URL 입력"
                  className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-xs text-gray-900 outline-none transition-all focus:border-[#8B6F47] focus:bg-white"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="w-full rounded-xl bg-[#8B6F47] py-3 text-xs font-bold text-white transition-all hover:bg-[#705835]"
                >
                  주소 추가
                </button>
              </div>
              <div className="md:col-span-2">
                <input
                  id={`garosugil-gallery-file-upload-${activeCategory.id}`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (!file) {
                      return;
                    }

                    const nextSlide = createEmptySlide();

                    updateCategory(activeCategory.id, (current) => ({
                      ...current,
                      slides: [...current.slides, nextSlide],
                    }));

                    onUploadImage(file, activeCategory.id, nextSlide.id);
                    event.target.value = "";
                  }}
                />
                <label
                  htmlFor={`garosugil-gallery-file-upload-${activeCategory.id}`}
                  className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-3 text-center text-xs font-bold text-gray-600 transition-all hover:border-[#8B6F47] hover:text-[#8B6F47]"
                >
                  파일 업로드
                </label>
              </div>
            </div>
          </div>

          <div className="max-h-[720px] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {activeCategory.slides.map((slide, index) => (
                <article
                  key={slide.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-gray-50">
                    {slide.imageSrc ? (
                      <Image
                        src={slide.imageSrc}
                        alt="슬라이드 이미지"
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
                    <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                      슬라이드 #{index + 1}
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    <Field label="슬라이드 제목 (KR)">
                      <TextInput
                        value={slide.title}
                        onChange={(value) =>
                          updateSlide(activeCategory.id, slide.id, (current) => ({
                            ...current,
                            title: value,
                          }))
                        }
                      />
                    </Field>

                    <Field label="슬라이드 제목 (EN)">
                      <TextInput
                        value={slide.titleEn ?? ""}
                        onChange={(value) =>
                          updateSlide(activeCategory.id, slide.id, (current) => ({
                            ...current,
                            titleEn: value,
                          }))
                        }
                      />
                    </Field>

                    <Field label="이미지 URL">
                      <TextInput
                        value={slide.imageSrc}
                        onChange={(value) =>
                          updateSlide(activeCategory.id, slide.id, (current) => ({
                            ...current,
                            imageSrc: value,
                          }))
                        }
                        placeholder="https://..."
                      />
                    </Field>

                    <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateCategory(activeCategory.id, (current) => ({
                            ...current,
                            slides: swapItems(current.slides, index, index - 1),
                          }))
                        }
                        disabled={index === 0}
                        className="rounded-lg border border-gray-100 bg-white p-1.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-white"
                        title="위로 이동"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateCategory(activeCategory.id, (current) => ({
                            ...current,
                            slides: swapItems(current.slides, index, index + 1),
                          }))
                        }
                        disabled={index === activeCategory.slides.length - 1}
                        className="rounded-lg border border-gray-100 bg-white p-1.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-white"
                        title="아래로 이동"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateCategory(activeCategory.id, (current) => ({
                            ...current,
                            slides: current.slides.filter((item) => item.id !== slide.id),
                          }))
                        }
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
      ) : null}
    </SectionCard>
  );
}
