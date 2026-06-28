"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AdminHotelBranch } from "@/app/admin/_components/hotels/admin-hotels-shared";
import { BranchPreparingModal } from "@/app/branches/_components/BranchPreparingModal";
import {
  buildBranchItems,
  buildPreparingBranchItem,
  getBranchDisplayAddressWithTranslations,
  getBranchDisplayDescriptionWithTranslations,
  getBranchDisplayFeaturesWithTranslations,
  getBranchDisplayNameWithTranslations,
  type BranchItem,
} from "@/app/branches/_components/branches.data";
import type { AppLocale } from "@/lib/i18n";
import {
  getLocalizedHotelRegionLabel,
  normalizeHotelRegionLabel,
} from "@/lib/hotel-branch-localization";
import { t, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

const baseRegionCatalog = [
  { label: "서울", icon: "/images/section-images/section-icon/서울.png" },
  { label: "대전", icon: "/images/section-images/section-icon/대전.png" },
  { label: "경기", icon: "/images/section-images/section-icon/경기.png" },
  { label: "충청", icon: "/images/section-images/section-icon/충청.png" },
  { label: "인천", icon: "/images/section-images/section-icon/인천.png" },
  { label: "경상", icon: "/images/section-images/section-icon/경상.png" },
  { label: "전라", icon: "/images/section-images/section-icon/전라.png" },
  { label: "강원", icon: "/images/section-images/section-icon/강원.png" },
  { label: "부산", icon: "/images/section-images/section-icon/부산.png" },
] as const;

const regionIconMap: Record<string, string> = Object.fromEntries(
  baseRegionCatalog.map((region) => [region.label, region.icon]),
);

function resolveRegionIcon(regionLabel: string) {
  const normalized = normalizeHotelRegionLabel(regionLabel);
  return regionIconMap[normalized] ?? "/images/section-images/section-icon/서울.png";
}

function resolveBranchImage(imageUrl?: string) {
  if (imageUrl) {
    return imageUrl;
  }

  return "/images/section-images/chat_2_0ca9a92d.png";
}

function resolveDetailHref(previewLink: string, slug: string) {
  if (previewLink.startsWith("/")) {
    return previewLink;
  }

  return `/locations/${slug}`;
}

type HomeLocationsSectionClientProps = {
  branches: AdminHotelBranch[];
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function HomeLocationsSectionClient({
  branches,
  locale,
  translations,
}: HomeLocationsSectionClientProps) {
  const messages = {
    sectionTitle: t(locale, translations, "home_locations_section_title"),
    sectionDescription: t(locale, translations, "home_locations_section_description"),
    branchSuffix: t(locale, translations, "home_locations_branch_suffix"),
    operating: t(locale, translations, "home_locations_operating"),
    ready: t(locale, translations, "home_locations_ready"),
    detail: t(locale, translations, "home_locations_detail"),
    reserve: t(locale, translations, "reserve_button"),
    footer: t(locale, translations, "home_locations_footer"),
  };
  const [selectedRegion, setSelectedRegion] = useState("서울");
  const [preparingBranch, setPreparingBranch] = useState<BranchItem | null>(null);
  const branchItems = buildBranchItems(branches);
  const visibleBranches = branches.filter((branch) => branch.isVisible);

  const dynamicRegions = Array.from(
    new Set(
      visibleBranches
        .map((branch) => normalizeHotelRegionLabel(branch.regionLabel))
        .filter((regionLabel) => regionLabel.length > 0),
    ),
  )
    .filter((regionLabel) => !baseRegionCatalog.some((region) => region.label === regionLabel))
    .map((regionLabel) => ({
      label: regionLabel,
      icon: resolveRegionIcon(regionLabel),
    }));

  const regions = [...baseRegionCatalog, ...dynamicRegions].map((region) => ({
    ...region,
    count: visibleBranches.filter(
      (branch) => normalizeHotelRegionLabel(branch.regionLabel) === region.label,
    ).length,
  }));

  const activeRegion = regions.some((region) => region.label === selectedRegion)
    ? selectedRegion
    : "서울";

  const filteredBranches = visibleBranches.filter(
    (branch) => normalizeHotelRegionLabel(branch.regionLabel) === activeRegion,
  );

  return (
    <section id="locations" className="bg-[#faf9f5] px-4 py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center">
          <p className="text-[14px] font-semibold tracking-[0.14em] text-[#9e7646]">
            NORA STAY LOCATIONS
          </p>
          <h2 className="mt-4 text-[36px] font-bold tracking-[-0.05em] text-[#2d2926]">
            {messages.sectionTitle}
          </h2>
          <p className="mt-4 text-[14px] leading-[1.8] text-gray-500">
            {messages.sectionDescription}
          </p>
        </div>

        <div className="mx-auto mt-18 flex max-w-[960px] flex-wrap items-start justify-center gap-x-12 gap-y-6">
          {regions.map((region) => {
            const isActive = activeRegion === region.label;
            const isAvailable = region.count > 0;
            const regionLabel = getLocalizedHotelRegionLabel(locale, region.label);

            return (
              <button
                key={region.label}
                type="button"
                onClick={() => setSelectedRegion(region.label)}
                className="group flex w-[62px] cursor-pointer flex-col items-center text-center transition-opacity duration-200"
              >
                <Image
                  src={region.icon}
                  alt={regionLabel}
                  width={40}
                  height={40}
                  className={[
                    "h-10 w-10 object-contain",
                    isActive ? "opacity-100" : isAvailable ? "opacity-90" : "opacity-20",
                  ].join(" ")}
                />

                <span
                  className={[
                    "mt-3 inline-flex items-center gap-1 text-[14px] font-semibold",
                    isActive
                      ? "text-[#9e7646]"
                      : isAvailable
                        ? "text-gray-700"
                        : "text-[#d8dce4]",
                  ].join(" ")}
                >
                  {regionLabel}
                  {region.count > 0 ? (
                    <span
                      className={[
                        "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                        isActive
                          ? "bg-[#9e7646] text-white"
                          : isAvailable
                            ? "bg-[#eef1f5] text-[#4a5565] group-hover:bg-[#d1d5dc]"
                            : "bg-[#f3f5f8] text-[#c3c9d2]",
                      ].join(" ")}
                    >
                      {region.count}
                    </span>
                  ) : null}
                </span>
                {isActive ? (
                  <span className="animate-[home-region-indicator-rise_220ms_cubic-bezier(0.22,1,0.36,1)] text-[#9e7646] will-change-[opacity,transform]">
                    ▼
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-16 flex max-w-[900px] flex-col gap-8">
          {filteredBranches.map((branch) => {
            const branchItem = branchItems.find((item) => item.id === branch.id);

            if (!branchItem) {
              return null;
            }

            return (
            <div
              key={branch.id}
              className="overflow-hidden rounded-[28px] border border-[#ece7df] bg-white shadow-sm"
            >
              <div className="grid grid-cols-2">
                <div className="relative min-h-[416px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveBranchImage(branch.images[0]?.url)}
                    alt={getBranchDisplayNameWithTranslations(branchItem, locale, translations)}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold text-[#9e7646] shadow-sm">
                    {getLocalizedHotelRegionLabel(locale, branch.regionLabel)} {messages.branchSuffix}
                  </span>
                </div>

                <div className="flex min-h-[416px] min-w-0 flex-col px-8 py-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[20px] font-bold tracking-[-0.04em] text-[#1e2a44]">
                      {getBranchDisplayNameWithTranslations(branchItem, locale, translations)}
                    </h3>
                    <span
                      className={[
                        "rounded-full px-2 py-1 text-[9px] font-bold",
                        branch.isFeatured
                          ? "bg-[#dff7ea] text-green-800"
                          : "bg-[#fef3c6] text-[#9e6d39]",
                      ].join(" ")}
                    >
                      {branch.isFeatured ? messages.operating : messages.ready}
                    </span>
                  </div>

                  <p className="mt-3 text-[14px] font-medium leading-[1.7] text-gray-500">
                    {getBranchDisplayAddressWithTranslations(branchItem, locale, translations)}
                  </p>

                  <p className="mt-4 break-keep text-[12px] leading-relaxed tracking-tighter text-gray-500">
                    {getBranchDisplayDescriptionWithTranslations(branchItem, locale, translations)}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {getBranchDisplayFeaturesWithTranslations(branchItem, locale, translations).map((tag) => (
                      <span
                        key={`${branch.id}-${tag}`}
                        className="rounded-[6px] bg-[#faf9f5] px-2 py-1 text-[9px] font-medium leading-[1.5] text-gray-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-wrap gap-3 pt-8">
                    {branch.isFeatured ? (
                      <>
                        <Link
                          href={resolveDetailHref(branch.previewLink, branch.slug)}
                          className="inline-flex h-[38px] flex-1 items-center justify-center rounded-full border border-[#e4ddd4] bg-white px-5 text-[12px] font-bold text-[#485266] shadow-sm transition-colors duration-200 hover:border-[#8c6239] hover:text-[#8c6239]"
                        >
                          {messages.detail}
                        </Link>
                        <Link
                          href={branch.bookingUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-[38px] flex-1 items-center justify-center rounded-full bg-[#9e6d39] px-5 text-[12px] font-bold text-white shadow-sm transition-colors duration-200 hover:bg-[#7f572d]"
                        >
                          {messages.reserve}
                        </Link>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setPreparingBranch(buildPreparingBranchItem(branch))}
                          className="inline-flex h-[38px] flex-1 items-center justify-center rounded-full border border-[#e4ddd4] bg-white px-5 text-[12px] font-bold text-[#485266] shadow-sm transition-colors duration-200 hover:border-[#8c6239] hover:text-[#8c6239]"
                        >
                          {messages.detail}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreparingBranch(buildPreparingBranchItem(branch))}
                          className="inline-flex h-[38px] flex-1 items-center justify-center rounded-full bg-[#c8cdd4] px-5 text-[12px] font-bold text-white shadow-sm transition-colors duration-200 hover:bg-[#b7bec7]"
                        >
                          {messages.ready}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        <p className="mt-14 text-center text-[12px] text-gray-400">{messages.footer}</p>
      </div>
      {preparingBranch ? (
        <BranchPreparingModal
          branch={preparingBranch}
          locale={locale}
          translations={translations}
          onClose={() => setPreparingBranch(null)}
        />
      ) : null}
      <style jsx>{`
        @keyframes home-region-indicator-rise {
          from {
            opacity: 0;
            transform: translate3d(0, 10px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </section>
  );
}
