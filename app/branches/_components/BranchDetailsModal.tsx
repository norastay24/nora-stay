"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import {
  getBranchDisplayAddressWithTranslations,
  getBranchDisplayDescriptionWithTranslations,
  getBranchDisplayFeaturesWithTranslations,
  getBranchDisplayHours,
  getBranchDisplayNameWithTranslations,
  type BranchItem,
} from "@/app/branches/_components/branches.data";
import { commonMessages, type AppLocale } from "@/lib/i18n";
import { getLocalizedHotelCategoryTag } from "@/lib/hotel-branch-localization";
import { t, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

interface BranchDetailsModalProps {
  branch: BranchItem;
  locale: AppLocale;
  translations: TranslationDictionaryMap;
  onClose: () => void;
}

function getTagEmoji(tag: string) {
  if (tag.includes("다이닝") || tag.includes("Dining")) return "🍽";
  if (tag.includes("스파") || tag.includes("사우나") || tag.includes("Spa")) return "🛀";
  if (tag.includes("엔터") || tag.includes("Entertainment")) return "🎵";
  if (tag.includes("컨셉") || tag.includes("Concept")) return "🏨";
  if (tag.includes("프라이빗") || tag.includes("Private")) return "🏡";
  if (tag.includes("정원") || tag.includes("테라스") || tag.includes("Garden")) return "🌳";
  return "♨️";
}

export function BranchDetailsModal({ branch, locale, translations, onClose }: BranchDetailsModalProps) {
  const messages = {
    close: t(locale, translations, "branches_close", {
      ko: commonMessages.branches.ko.close,
      en: commonMessages.branches.en.close,
    }),
    prevImage: t(locale, translations, "branches_prev_image", {
      ko: commonMessages.branches.ko.prevImage,
      en: commonMessages.branches.en.prevImage,
    }),
    nextImage: t(locale, translations, "branches_next_image", {
      ko: commonMessages.branches.ko.nextImage,
      en: commonMessages.branches.en.nextImage,
    }),
    naverMap: t(locale, translations, "branches_naver_map", {
      ko: commonMessages.branches.ko.naverMap,
      en: commonMessages.branches.en.naverMap,
    }),
    basicInfo: t(locale, translations, "branches_basic_info", {
      ko: commonMessages.branches.ko.basicInfo,
      en: commonMessages.branches.en.basicInfo,
    }),
    introduction: locale === "ko" ? "소개" : "Introduction",
    hotelFeatures: t(locale, translations, "branches_hotel_features", {
      ko: commonMessages.branches.ko.hotelFeatures,
      en: commonMessages.branches.en.hotelFeatures,
    }),
    viewRooms: t(locale, translations, "branches_view_rooms", {
      ko: commonMessages.branches.ko.viewRooms,
      en: commonMessages.branches.en.viewRooms,
    }),
    goReserve: t(locale, translations, "branches_go_reserve", {
      ko: commonMessages.branches.ko.goReserve,
      en: commonMessages.branches.en.goReserve,
    }),
  };
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const totalImages = branch.imageSources.length;
  const branchName = getBranchDisplayNameWithTranslations(branch, locale, translations);
  const branchAddress = getBranchDisplayAddressWithTranslations(branch, locale, translations);
  const branchHours = getBranchDisplayHours(branch, locale);
  const branchDescription = getBranchDisplayDescriptionWithTranslations(branch, locale, translations);
  const branchFeatures = getBranchDisplayFeaturesWithTranslations(branch, locale, translations);

  useEffect(() => {
    if (totalImages <= 1) return;
    const interval = window.setInterval(() => {
      setActiveImageIndex((curr) => (curr + 1) % totalImages);
    }, 3000);
    return () => window.clearInterval(interval);
  }, [totalImages]);

  function moveSlide(direction: "prev" | "next") {
    setActiveImageIndex((curr) => {
      if (direction === "prev") return curr === 0 ? totalImages - 1 : curr - 1;
      return curr === totalImages - 1 ? 0 : curr + 1;
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(17,24,39,0.42)] p-0 xl:items-center xl:p-8"
      onClick={onClose}
    >
      <div
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#f8f6f1] shadow-[0_32px_80px_rgba(17,24,39,0.22)] animate-[branch-details-mobile-sheet-in_600ms_cubic-bezier(0.22,1,0.36,1)] xl:max-h-[92vh] xl:max-w-[1000px] xl:rounded-[28px] xl:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-[#1f2937] shadow-[0_10px_24px_rgba(17,24,39,0.12)] xl:left-auto xl:right-5 xl:top-5 xl:h-8 xl:w-8 xl:text-[#5d544b] xl:transition-transform xl:hover:scale-105"
          aria-label={messages.close}
        >
          <ChevronLeft className="h-5 w-5 xl:hidden" strokeWidth={2.2} />
          <X className="hidden h-4 w-4 xl:block" strokeWidth={2} />
        </button>

        <div className="relative h-[36vh] min-h-[250px] w-full shrink-0 overflow-hidden bg-[#e9e2d8] xl:h-[52vh] xl:min-h-[280px]">
          {branch.imageSources.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={`${branchName} ${index + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${index === activeImageIndex ? "opacity-100" : "opacity-0"}`}
            />
          ))}

          {totalImages > 1 ? (
            <>
              <button
                type="button"
                onClick={() => moveSlide("prev")}
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-[2px] transition-colors hover:bg-black/60 xl:left-6"
                aria-label={messages.prevImage}
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={() => moveSlide("next")}
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-[2px] transition-colors hover:bg-black/60 xl:right-6"
                aria-label={messages.nextImage}
              >
                <ChevronRight className="h-6 w-6" strokeWidth={2.2} />
              </button>
              <div className="absolute bottom-4 right-4 z-10 rounded-full bg-[rgba(17,24,39,0.82)] px-3 py-1 text-[10px] font-bold tracking-[0.1em] text-white xl:right-6">
                {activeImageIndex + 1}/{totalImages}
              </div>
            </>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="bg-white px-4 py-4 xl:px-10 xl:py-8">
            <div className="flex flex-wrap items-center gap-y-2 text-[11px] font-semibold tracking-[-0.03em] text-[#9c7b4b] xl:text-[12px]">
              {branch.tags.map((tag, index) => (
                <span key={tag} className="inline-flex items-center">
                  {index > 0 ? (
                    <span className="mx-2 text-[9px] text-[#d6dbe2]" aria-hidden="true">
                      •
                    </span>
                  ) : null}
                  <span>
                    {getTagEmoji(tag)} {getLocalizedHotelCategoryTag(locale, tag)}
                  </span>
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-1.5 xl:mt-6 xl:gap-2">
              <h2 className="text-[19px] font-bold tracking-[-0.06em] text-[#152033] xl:text-[24px]">{branchName}</h2>
              {locale === "ko" && branch.englishName.trim().length > 0 ? (
                <span className="text-[12px] tracking-[-0.04em] text-[#9aa4b2] xl:text-[16px]">/ {branch.englishName}</span>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 border-b border-gray-100 pb-5 text-[11px] text-gray-500 xl:mt-4 xl:gap-x-3 xl:pb-5 xl:text-[12px]">
              <span className="flex items-center gap-1 font-medium text-gray-700">
                <span>🕒</span> {branchHours}
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <span>📍</span> {branchAddress}
              </span>
              <span className="text-gray-300">|</span>

              <Link
                href={`https://map.naver.com/p/search/${encodeURIComponent(branch.address)}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 font-bold text-[#00a359] transition-opacity hover:opacity-80"
              >
                <MapPin size={14} className="text-[#00a359]" />
                <span className="xl:hidden">{locale === "ko" ? "길찾기" : "Directions"}</span>
                <span className="hidden xl:inline">{messages.naverMap}</span>
              </Link>
            </div>

            <div className="mt-5 xl:mt-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-[13px] font-bold text-[#152033] xl:text-[14px]">{messages.basicInfo}</h3>
              </div>
              <h4 className="mt-4 text-[12px] font-bold text-[#9c7b4b] xl:mt-6">{messages.introduction}</h4>
              <p className="mt-2.5 text-[12px] leading-[1.65] text-[#586272] xl:mt-3 xl:text-[14px] xl:leading-[1.6]">{branchDescription}</p>

              <div className="mt-6 xl:mt-8">
                <h4 className="text-[12px] font-bold text-[#9c7b4b]">{messages.hotelFeatures}</h4>
                <div className="mt-3 space-y-2.5 xl:mt-4 xl:space-y-3">
                  {branchFeatures.map((feature) => (
                    <p key={feature} className="text-[12px] xl:text-[14px]">
                      <span className="text-[#8b6f47]">- </span>
                      <span className="text-[#586272]">{feature}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-6 hidden gap-3 border-t border-gray-100 pt-6 xl:flex">
                <Link
                  href={branch.href}
                  className="inline-flex h-[40px] flex-1 items-center justify-center rounded-full bg-[#a1814d] px-4 text-[13px] font-bold text-white transition-colors hover:bg-[#8b6f47]"
                >
                  {messages.viewRooms}
                </Link>
                <Link
                  href={branch.reservationHref}
                  target="_blank"
                  className="inline-flex h-[40px] flex-1 items-center justify-center rounded-full bg-[#1f1f1f] px-4 text-[13px] font-bold text-white transition-colors hover:bg-[#333333]"
                >
                  {messages.goReserve}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-gray-100 bg-white/96 px-4 pb-4 pt-3 backdrop-blur xl:hidden">
          <div className="flex gap-2.5">
            <Link
              href={branch.href}
              className="inline-flex h-[42px] flex-1 items-center justify-center rounded-full bg-[#a1814d] px-4 text-[13px] font-bold text-white transition-colors hover:bg-[#8b6f47]"
            >
              {messages.viewRooms}
            </Link>
            <Link
              href={branch.reservationHref}
              target="_blank"
              className="inline-flex h-[42px] flex-1 items-center justify-center rounded-full bg-[#1f1f1f] px-4 text-[13px] font-bold text-white transition-colors hover:bg-[#333333]"
            >
              {messages.goReserve}
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes branch-details-mobile-sheet-in {
          from {
            opacity: 0;
            transform: translate3d(0, 100%, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
