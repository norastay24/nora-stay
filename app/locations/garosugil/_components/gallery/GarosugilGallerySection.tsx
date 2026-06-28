"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  createDefaultGarosugilContent,
  type GarosugilGallerySectionContent,
} from "@/lib/garosugil-content";
import { type AppLocale } from "@/lib/i18n";
import { translateKeyedValue } from "@/lib/keyed-translations";
import type { TranslationDictionaryMap } from "@/lib/translation-dictionary";

type GarosugilGallerySectionProps = {
  content?: GarosugilGallerySectionContent;
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function GarosugilGallerySection({
  content = createDefaultGarosugilContent().gallery,
  locale,
  translations,
}: GarosugilGallerySectionProps) {
  const keyBase = "location.garosugil.gallery";
  const defaultCategoryId = content.categories[1]?.id ?? content.categories[0]?.id ?? "dining";
  const [activeCategoryId, setActiveCategoryId] = useState(defaultCategoryId);
  const [slideIndex, setSlideIndex] = useState(0);

  const activeCategory =
    content.categories.find((category) => category.id === activeCategoryId) ??
    content.categories.find((category) => category.id === defaultCategoryId) ??
    content.categories[0];

  if (!activeCategory) {
    return null;
  }

  const categoryLeadSlide = activeCategory.slides[0];
  const totalSlides = activeCategory.slides.length;
  const safeSlideIndex = Math.min(slideIndex, Math.max(totalSlides - 1, 0));

  function handleCategoryChange(categoryId: string) {
    setActiveCategoryId(categoryId);
    setSlideIndex(0);
  }

  function handlePrev() {
    setSlideIndex((current) => (current === 0 ? totalSlides - 1 : current - 1));
  }

  function handleNext() {
    setSlideIndex((current) => (current === totalSlides - 1 ? 0 : current + 1));
  }

  return (
    <section className="bg-[#fdfbf7] px-6 py-24 md:px-10 md:py-28 max-[640px]:px-4 max-[640px]:py-16">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="text-center">
          <p className="text-[12px] font-bold tracking-[0.20em] text-[#8b6f47] max-[640px]:text-[11px]">
            {translateKeyedValue(locale, translations, `${keyBase}.eyebrow`, content.eyebrow, content.eyebrowEn)}
          </p>
          <h2 className="mt-3 text-[36px] font-extrabold tracking-[-0.02em] text-[#101b34] max-[1024px]:text-[32px] max-[640px]:text-[26px]">
            {translateKeyedValue(locale, translations, `${keyBase}.title`, content.title, content.titleEn)}
          </h2>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex flex-wrap gap-1.5 rounded-[24px] border border-gray-200/50 bg-gray-100/80 p-1.5 backdrop-blur max-[640px]:flex-nowrap max-[640px]:overflow-x-auto">
            {content.categories.map((category) => {
              const isActive = category.id === activeCategory.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.id)}
                  className={[
                    "rounded-[24px] px-5 py-2.5 text-xs font-bold tracking-wider transition-all duration-300 max-[640px]:shrink-0 max-[640px]:px-4 max-[640px]:py-2 max-[640px]:text-[11px]",
                    isActive
                      ? "bg-white font-extrabold shadow-md"
                      : "text-gray-500 hover:bg-white/40 hover:text-gray-900",
                  ].join(" ")}
                  style={isActive ? { color: "rgb(139, 111, 71)" } : {}}
                >
                  {translateKeyedValue(locale, translations, `${keyBase}.category.${category.id}.label`, category.label, category.labelEn)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="group relative mx-auto mt-10 max-w-[1200px] rounded-[24px] border border-[#f1ece4] bg-white shadow-[0_16px_38px_rgba(17,24,39,0.08)] max-[640px]:rounded-[20px]">
          <div className="relative aspect-[1.78/1] overflow-hidden rounded-t-[16px] max-[640px]:h-[240px] max-[640px]:aspect-auto max-[640px]:rounded-t-[20px]">
            <div
              className="flex h-full w-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${safeSlideIndex * 100}%)` }}
            >
              {activeCategory.slides.map((slide) => (
                <div key={slide.id} className="relative h-full min-w-full">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 920px"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-5 top-1/2 flex h-[54px] w-[54px] -translate-y-1/2 items-center justify-center rounded-full bg-white/96 text-[#3f4654] opacity-0 shadow-[0_10px_24px_rgba(17,24,39,0.12)] transition-all duration-300 ease-out hover:bg-white group-hover:translate-x-0 group-hover:opacity-100 motion-safe:-translate-x-2 max-[640px]:left-3 max-[640px]:h-11 max-[640px]:w-11 max-[640px]:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-[22px] w-[22px] max-[640px]:h-[18px] max-[640px]:w-[18px]" strokeWidth={2.1} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-5 top-1/2 flex h-[54px] w-[54px] -translate-y-1/2 items-center justify-center rounded-full bg-white/96 text-[#3f4654] opacity-0 shadow-[0_10px_24px_rgba(17,24,39,0.12)] transition-all duration-300 ease-out hover:bg-white group-hover:translate-x-0 group-hover:opacity-100 motion-safe:translate-x-2 max-[640px]:right-3 max-[640px]:h-11 max-[640px]:w-11 max-[640px]:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight className="h-[22px] w-[22px] max-[640px]:h-[18px] max-[640px]:w-[18px]" strokeWidth={2.1} />
            </button>

            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
              {activeCategory.slides.map((slide, index) => (
                <span
                  key={`${slide.id}-${index}`}
                  className={[
                    "block h-[6px] rounded-full transition-all duration-200",
                    index === safeSlideIndex ? "w-[18px] bg-white" : "w-[6px] bg-white/55",
                  ].join(" ")}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          <div className="flex min-h-[138px] items-center justify-between gap-6 px-8 py-8 max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-4 max-[640px]:px-5 max-[640px]:py-5">
            <div className="min-h-[82px] max-w-[700px] max-[640px]:min-h-0 max-[640px]:max-w-full">
              <p className="text-[13px] font-extrabold tracking-[0.22em] text-[#b38a54] max-[640px]:text-[11px]">
                {translateKeyedValue(locale, translations, `${keyBase}.category.${activeCategory.id}.slide.${categoryLeadSlide.id}.title`, categoryLeadSlide.title, categoryLeadSlide.titleEn)}
              </p>
              <p className="mt-3 text-[14px] leading-[1.8] tracking-[-0.03em] text-[#7f8997] max-[640px]:text-[13px]">
                {translateKeyedValue(locale, translations, `${keyBase}.category.${activeCategory.id}.description`, activeCategory.description, activeCategory.descriptionEn)}
              </p>
            </div>

            <div className="inline-flex h-[34px] min-w-[54px] items-center justify-center rounded-full bg-[#f8f9fb] px-4 text-[13px] font-bold tracking-[-0.03em] text-[#a9b2c0] max-[640px]:self-end max-[640px]:text-[12px]">
              {safeSlideIndex + 1}/{totalSlides}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
