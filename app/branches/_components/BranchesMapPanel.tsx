"use client";

import { ChevronLeft, ChevronRight, Crosshair, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import type { BranchItem, BranchTag } from "@/app/branches/_components/branches.data";
import { commonMessages, type AppLocale } from "@/lib/i18n";
import { getLocalizedHotelCategoryTag } from "@/lib/hotel-branch-localization";
import { t, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

function getTagEmoji(tag: string) {
  if (tag.includes("다이닝") || tag.includes("Dining")) {
    return "🍽";
  }

  if (tag.includes("스파") || tag.includes("사우나") || tag.includes("Spa")) {
    return "🛀";
  }

  if (tag.includes("엔터") || tag.includes("Entertainment")) {
    return "🎵";
  }

  if (tag.includes("컨셉") || tag.includes("Concept")) {
    return "🏨";
  }

  if (tag.includes("프라이빗") || tag.includes("Private")) {
    return "🏢";
  }

  if (tag.includes("정원") || tag.includes("테라스") || tag.includes("Garden")) {
    return "🌿";
  }

  return "✨";
}

type NaverMapLike = {
  setCenter: (latLng: unknown) => void;
  setZoom: (zoom: number) => void;
  getZoom: () => number;
};

type NaverMarkerLike = {
  setPosition: (latLng: unknown) => void;
  setIcon: (icon: { content: string; anchor: unknown }) => void;
};

function createMarkerIcon(color: string, isActive: boolean) {
  return `
    <div style="
      position:relative;
      width:56px;
      height:78px;
      display:flex;
      align-items:flex-start;
      justify-content:center;
      transform:scale(${isActive ? "1" : "0.88"});
      transform-origin:center bottom;
    ">
      <div style="
        position:relative;
        width:56px;
        height:56px;
        border-radius:9999px;
        background:${color};
        box-shadow:0 10px 22px rgba(74,44,17,0.22);
        display:flex;
        align-items:center;
        justify-content:center;
      ">
        <svg
          width="${isActive ? "34" : "30"}"
          height="${isActive ? "34" : "30"}"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="display:block"
        >
          <path
            d="M18 5h4"
            stroke="#f7f0e8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M20 3v4"
            stroke="#f7f0e8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
            stroke="#f7f0e8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div style="
          position:absolute;
          left:50%;
          bottom:-24px;
          width:24px;
          height:30px;
          background:${color};
          clip-path:polygon(50% 100%, 16% 0, 84% 0);
          transform:translateX(-50%);
          box-shadow:0 12px 18px rgba(74,44,17,0.14);
        "></div>
      </div>
    </div>
  `;
}

interface BranchesMapPanelProps {
  branches: BranchItem[];
  activeBranch: BranchItem;
  activeTags: BranchTag[];
  locale: AppLocale;
  translations: TranslationDictionaryMap;
  onSelectBranch: (branchId: string) => void;
  onToggleTag: (tag: BranchTag) => void;
}

export function BranchesMapPanel({
  branches,
  activeBranch,
  activeTags,
  locale,
  translations,
  onSelectBranch,
  onToggleTag,
}: BranchesMapPanelProps) {
  const messages = {
    currentLocation: t(locale, translations, "branches_current_location", {
      ko: commonMessages.branches.ko.currentLocation,
      en: commonMessages.branches.en.currentLocation,
    }),
    zoomIn: t(locale, translations, "branches_zoom_in", {
      ko: commonMessages.branches.ko.zoomIn,
      en: commonMessages.branches.en.zoomIn,
    }),
    zoomOut: t(locale, translations, "branches_zoom_out", {
      ko: commonMessages.branches.ko.zoomOut,
      en: commonMessages.branches.en.zoomOut,
    }),
  };
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const tagScrollRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<unknown>(null);
  const markersRef = useRef<Map<string, unknown>>(new Map());
  const [isScriptReady, setIsScriptReady] = useState(false);
  const mapFilterTags = Array.from(new Set(branches.flatMap((branch) => branch.tags).filter(Boolean)));

  useEffect(() => {
    if (!isScriptReady || !mapElementRef.current || !window.naver?.maps) {
      return;
    }

    const { maps } = window.naver;

    if (!mapRef.current) {
      mapRef.current = new maps.Map(mapElementRef.current, {
        center: new maps.LatLng(activeBranch.coordinates.lat, activeBranch.coordinates.lng),
        zoom: 18,
        minZoom: 7,
        mapDataControl: false,
        scaleControl: false,
        logoControl: false,
        zoomControl: false,
      });
    }

    const map = mapRef.current as NaverMapLike;
    const existingMarkers = markersRef.current;

    branches.forEach((branch) => {
      let marker = existingMarkers.get(branch.id) as NaverMarkerLike | undefined;

      if (!marker) {
        const newMarker = new maps.Marker({
          position: new maps.LatLng(branch.coordinates.lat, branch.coordinates.lng),
          map,
          icon: {
            content: createMarkerIcon(branch.themeColor, branch.id === activeBranch.id),
            anchor: new maps.Point(28, 72),
          },
        });

        maps.Event.addListener(newMarker, "click", () => {
          onSelectBranch(branch.id);
        });

        existingMarkers.set(branch.id, newMarker as unknown);
        marker = newMarker as unknown as NaverMarkerLike;
      } else {
        marker.setPosition(new maps.LatLng(branch.coordinates.lat, branch.coordinates.lng));
        marker.setIcon({
          content: createMarkerIcon(branch.themeColor, branch.id === activeBranch.id),
          anchor: new maps.Point(28, 72),
        });
      }
    });

    map.setCenter(new maps.LatLng(activeBranch.coordinates.lat, activeBranch.coordinates.lng));
    map.setZoom(13);
  }, [activeBranch, branches, isScriptReady, onSelectBranch]);

  useEffect(() => {
    if (!isScriptReady || !mapElementRef.current || !window.naver?.maps || !mapRef.current) {
      return;
    }

    const { maps } = window.naver;
    const map = mapRef.current;
    const targetElement = mapElementRef.current;

    const handleResize = () => {
      maps.Event.trigger(map, "resize");

      const resizedMap = mapRef.current as NaverMapLike | null;

      if (!resizedMap) {
        return;
      }

      resizedMap.setCenter(new maps.LatLng(activeBranch.coordinates.lat, activeBranch.coordinates.lng));
    };

    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(handleResize);
    });

    observer.observe(targetElement);
    window.requestAnimationFrame(handleResize);

    return () => {
      observer.disconnect();
    };
  }, [activeBranch.coordinates.lat, activeBranch.coordinates.lng, isScriptReady]);

  function moveToCurrentLocation() {
    if (!navigator.geolocation || !window.naver?.maps || !mapRef.current) {
      return;
    }

    const { maps } = window.naver;

    navigator.geolocation.getCurrentPosition((position) => {
      const map = mapRef.current as NaverMapLike | null;
      map?.setCenter(new maps.LatLng(position.coords.latitude, position.coords.longitude));
      map?.setZoom(13);
    });
  }

  function zoomMapBy(step: number) {
    if (!mapRef.current) {
      return;
    }

    const map = mapRef.current as NaverMapLike | null;

    if (!map) {
      return;
    }

    const currentZoom = map.getZoom();
    map.setZoom(currentZoom + step);
  }

  function scrollTagsBy(offset: number) {
    tagScrollRef.current?.scrollBy({
      left: offset,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative h-full w-full bg-[#f7f3ec]">
      {NAVER_MAP_CLIENT_ID ? (
        <Script
          id="naver-maps-script"
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`}
          strategy="afterInteractive"
          onReady={() => {
            setIsScriptReady(true);
          }}
        />
      ) : null}

      <div ref={mapElementRef} className="h-full w-full" />

      <div className="pointer-events-none absolute left-8 right-6 top-6 z-10 max-[1279px]:left-3 max-[1279px]:right-3 max-[1279px]:top-3">
        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={() => scrollTagsBy(-180)}
            className="pointer-events-auto hidden h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#ebe3d8] bg-white text-[#4a4036] shadow-[0_6px_18px_rgba(17,24,39,0.10)] max-[1279px]:inline-flex"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
          </button>

          <div
            ref={tagScrollRef}
            className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex min-w-max items-center gap-3 max-[1279px]:gap-2">
              {mapFilterTags.map((tag) => {
                const isActive = activeTags.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onToggleTag(tag)}
                    className={`pointer-events-auto inline-flex h-[40px] items-center rounded-full border px-4 text-[14px] font-bold tracking-[-0.03em] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all duration-200 max-[1279px]:h-[34px] max-[1279px]:shrink-0 max-[1279px]:px-3 max-[1279px]:text-[12px] ${isActive
                        ? "border-[#4f3216] bg-[#291b0c] text-white"
                        : "border-[#ebe3d8] bg-white text-[#2b2117] hover:border-[#dcd6ce]"
                      }`}
                  >
                    {getTagEmoji(tag)} {getLocalizedHotelCategoryTag(locale, tag)}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollTagsBy(180)}
            className="pointer-events-auto hidden h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#ebe3d8] bg-white text-[#4a4036] shadow-[0_6px_18px_rgba(17,24,39,0.10)] max-[1279px]:inline-flex"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 flex flex-col items-end gap-3 max-[1279px]:bottom-4 max-[1279px]:right-4 max-[1279px]:gap-2">
        <button
          type="button"
          onClick={moveToCurrentLocation}
          className="flex h-[56px] w-[56px] items-center justify-center rounded-[16px] border border-[#ebe6dd] bg-white text-[#233040] shadow-[0_10px_24px_rgba(17,24,39,0.12)] transition-colors hover:bg-[#faf8f4] max-[1279px]:h-[44px] max-[1279px]:w-[44px] max-[1279px]:rounded-[12px]"
          aria-label={messages.currentLocation}
        >
          <Crosshair className="h-6 w-6 max-[1279px]:h-5 max-[1279px]:w-5" strokeWidth={2.1} />
        </button>

        <div className="overflow-hidden rounded-[16px] border border-[#ebe6dd] bg-white shadow-[0_10px_24px_rgba(17,24,39,0.12)] max-[1279px]:rounded-[12px]">
          <button
            type="button"
            onClick={() => {
              zoomMapBy(1);
            }}
            className="flex h-[56px] w-[56px] items-center justify-center text-[#233040] transition-colors hover:bg-[#faf8f4] max-[1279px]:h-[44px] max-[1279px]:w-[44px]"
            aria-label={messages.zoomIn}
          >
            <Plus className="h-7 w-7 max-[1279px]:h-5 max-[1279px]:w-5" strokeWidth={2} />
          </button>
          <div className="h-px w-full bg-[#ece7de]" />
          <button
            type="button"
            onClick={() => {
              zoomMapBy(-1);
            }}
            className="flex h-[56px] w-[56px] items-center justify-center text-[#233040] transition-colors hover:bg-[#faf8f4] max-[1279px]:h-[44px] max-[1279px]:w-[44px]"
            aria-label={messages.zoomOut}
          >
            <Minus className="h-7 w-7 max-[1279px]:h-5 max-[1279px]:w-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
