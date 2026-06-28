"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Clock3, MapPin, Search } from "lucide-react";
import {
  buildBranchFilterTags,
  getBranchDisplayAddressWithTranslations,
  getBranchDisplayHours,
  getBranchDisplayNameWithTranslations,
  type BranchItem,
  type BranchTag,
} from "@/app/branches/_components/branches.data";
import { BranchDetailsModal } from "@/app/branches/_components/BranchDetailsModal";
import { BranchPreparingModal } from "@/app/branches/_components/BranchPreparingModal";
import { BranchesMapPanel } from "@/app/branches/_components/BranchesMapPanel";
import { commonMessages, type AppLocale } from "@/lib/i18n";
import { getLocalizedHotelCategoryTag } from "@/lib/hotel-branch-localization";
import { t, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

function badgeClassName(badge: BranchItem["badge"]) {
  if (badge === "NEW") {
    return "bg-[#ffc320] text-white";
  }

  return "bg-[#f2efeb] text-[#8a7a77]";
}

type BranchesPageShellProps = {
  branches: BranchItem[];
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

export function BranchesPageShell({ branches, locale, translations }: BranchesPageShellProps) {
  const categoryScrollRef = useRef<HTMLDivElement | null>(null);
  const messages = {
    title: t(locale, translations, "branches_title", {
      ko: commonMessages.branches.ko.title,
      en: commonMessages.branches.en.title,
    }),
    totalPrefix: t(locale, translations, "branches_total_prefix", {
      ko: commonMessages.branches.ko.totalPrefix,
      en: commonMessages.branches.en.totalPrefix,
    }),
    totalSuffix: t(locale, translations, "branches_total_suffix", {
      ko: commonMessages.branches.ko.totalSuffix,
      en: commonMessages.branches.en.totalSuffix,
    }),
    searchPlaceholder: t(locale, translations, "branches_search_placeholder", {
      ko: commonMessages.branches.ko.searchPlaceholder,
      en: commonMessages.branches.en.searchPlaceholder,
    }),
    branchList: t(locale, translations, "branches_branch_list", {
      ko: commonMessages.branches.ko.branchList,
      en: commonMessages.branches.en.branchList,
    }),
    noResultsTitle: t(locale, translations, "branches_no_results_title", {
      ko: commonMessages.branches.ko.noResultsTitle,
      en: commonMessages.branches.en.noResultsTitle,
    }),
    noResultsDescription: t(locale, translations, "branches_no_results_description", {
      ko: commonMessages.branches.ko.noResultsDescription,
      en: commonMessages.branches.en.noResultsDescription,
    }),
    sortPopular: t(locale, translations, "branches_sort_popular", {
      ko: commonMessages.branches.ko.sortOptions[0],
      en: commonMessages.branches.en.sortOptions[0],
    }),
    sortNewest: t(locale, translations, "branches_sort_newest", {
      ko: commonMessages.branches.ko.sortOptions[1],
      en: commonMessages.branches.en.sortOptions[1],
    }),
    mobileListView: locale === "ko" ? "지점 목록 보기" : "Browse locations",
    mobileMapView: locale === "ko" ? "지도에서 찾기" : "Find on map",
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<BranchTag[]>([]);
  const [activeBranchId, setActiveBranchId] = useState(branches[0]?.id ?? "");
  const [sortOption, setSortOption] = useState<string>(messages.sortNewest);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [openedBranchId, setOpenedBranchId] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const branchFilterTags = buildBranchFilterTags(branches);

  function scrollCategoriesBy(offset: number) {
    categoryScrollRef.current?.scrollBy({
      left: offset,
      behavior: "smooth",
    });
  }

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpenedBranchId(null);
      setIsClosing(false);
    }, 300);
  };

  const filteredBranches = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return branches
      .filter((branch) => {
        const matchesTag =
          activeTags.length > 0 ? activeTags.every((tag) => branch.tags.includes(tag)) : true;
        const matchesQuery = normalizedQuery
          ? [
            getBranchDisplayNameWithTranslations(branch, locale, translations),
            getBranchDisplayAddressWithTranslations(branch, locale, translations),
            branch.tags.map((tag) => getLocalizedHotelCategoryTag(locale, tag)).join(" "),
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
          : true;

        return matchesTag && matchesQuery;
      })
      .sort((leftBranch, rightBranch) => {
        const leftIndex = branches.findIndex((branch) => branch.id === leftBranch.id);
        const rightIndex = branches.findIndex((branch) => branch.id === rightBranch.id);

        if (sortOption === messages.sortNewest) {
          return leftIndex - rightIndex;
        }

        if (leftBranch.badge === rightBranch.badge) {
          return leftIndex - rightIndex;
        }

        return leftBranch.badge === "NEW" ? -1 : 1;
      });
  }, [activeTags, branches, locale, messages.sortNewest, searchQuery, sortOption, translations]);

  const activeBranch =
    filteredBranches.find((branch) => branch.id === activeBranchId) ??
    filteredBranches[0] ??
    branches[0] ??
    null;
  const openedBranch = branches.find((branch) => branch.id === openedBranchId) ?? null;

  return (
    <section className="flex h-[calc(100vh-80px)] flex-col overflow-hidden border-t border-[#f0ebe3] bg-[#f8f5ef]">
      <div className="border-b border-[#ece6dc] bg-white px-3 py-2 xl:hidden">
        <div className="grid grid-cols-2 ">
          <button
            type="button"
            onClick={() => setMobileView("list")}
            className={[
              "inline-flex h-[38px] items-center justify-center gap-1.5 rounded-[18px] px-3 text-[12px] font-bold tracking-[-0.04em] transition-colors",
              mobileView === "list"
                ? "bg-[#9c7b4b] text-white shadow-[0_4px_8px_rgba(156,123,75,0.2)]"
                : "bg-transparent text-[#5b6677]",
            ].join(" ")}
          >
            <span aria-hidden="true">🏨</span>
            <span>{messages.mobileListView}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView("map")}
            className={[
              "inline-flex h-[38px] items-center justify-center gap-1.5 rounded-[18px] px-3 text-[12px] font-bold tracking-[-0.04em] transition-colors",
              mobileView === "map"
                ? "bg-[#9c7b4b] text-white shadow-[0_4px_8px_rgba(156,123,75,0.2)]"
                : "bg-transparent text-[#5b6677]",
            ].join(" ")}
          >
            <span aria-hidden="true">📍</span>
            <span>{messages.mobileMapView}</span>
          </button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(360px,420px)_minmax(0,1fr)]">
        <aside
          className={[
            "h-full min-h-0 flex-col overflow-hidden border-r border-[#ede6dc] bg-white",
            mobileView === "list" ? "flex" : "hidden",
            "xl:flex",
          ].join(" ")}
        >
          <div className="border-b border-[#f1ebe3] px-6 pb-6 pt-5 max-[1279px]:px-5 max-[1279px]:pb-4 max-[1279px]:pt-4">
            <h1 className="text-[24px] font-bold tracking-[-0.06em] text-[#152033] max-[1279px]:text-[20px]">
              {messages.title}
            </h1>
            <p className="mt-2 text-[16px] tracking-[-0.04em] text-[#8c6239] max-[1279px]:mt-1 max-[1279px]:text-[14px]">
              {messages.totalPrefix} {filteredBranches.length}
              {messages.totalSuffix}
            </p>
          </div>

          <div className="border-b border-[#f1ebe3] px-5 py-4 max-[1279px]:py-3">
            <label className="flex h-[42px] items-center gap-3 rounded-full border border-[#eee7de] bg-[#faf8f4] px-5 max-[1279px]:h-[38px] max-[1279px]:px-4">
              <Search className="h-[22px] w-[22px] text-[#95867f]" strokeWidth={2.2} />
              <input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                }}
                placeholder={messages.searchPlaceholder}
                className="w-full border-0 bg-transparent p-0 text-[14px] tracking-[-0.03em] text-[#6f7a8a] outline-none placeholder:text-[#9e97a0]"
              />
            </label>
          </div>

          <div className="border-b border-[#f1ebe3] px-5 py-3 max-[1279px]:py-2.5">
            <div className="flex items-center gap-2 xl:block">
              <button
                type="button"
                onClick={() => scrollCategoriesBy(-180)}
                className="hidden h-[34px] shrink-0 items-center justify-center px-1 text-[#5c534f] max-[1279px]:inline-flex"
                aria-label="Scroll categories left"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
              </button>

              <div
                ref={categoryScrollRef}
                className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:w-full xl:overflow-visible"
              >
                <div className="flex min-w-max gap-[8px] max-[1279px]:flex-nowrap xl:min-w-0 xl:flex-wrap">
                  {branchFilterTags.map((tag) => {
                    const isActive = activeTags.includes(tag);

                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setActiveTags((currentTags) =>
                            currentTags.includes(tag)
                              ? currentTags.filter((currentTag) => currentTag !== tag)
                              : [...currentTags, tag],
                          );
                        }}
                        className={[
                          "inline-flex h-[30px] items-center rounded-full border px-3 text-[12px] font-semibold tracking-[-0.03em] max-[1279px]:h-[28px] max-[1279px]:shrink-0 max-[1279px]:px-2.5 max-[1279px]:text-[11px]",
                          isActive
                            ? "border-[#9c7b4b] bg-[#9c7b4b] text-white"
                            : "border-[#eee7de] bg-white text-[#8a7a77]",
                        ].join(" ")}
                      >
                        {getLocalizedHotelCategoryTag(locale, tag)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => scrollCategoriesBy(180)}
                className="hidden h-[34px] shrink-0 items-center justify-center px-1 text-[#5c534f] max-[1279px]:inline-flex"
                aria-label="Scroll categories right"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-[#f1ebe3] bg-[#fdfdfc] px-5 py-4 max-[1279px]:py-3">
            <span className="text-[12px] tracking-[-0.03em] text-[#8a7a77]">
              {messages.branchList}
            </span>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(event) => {
                  setSortOption(event.target.value);
                }}
                className="appearance-none bg-transparent pr-4 text-[12px] font-bold tracking-[-0.04em] text-[#152033] outline-none"
              >
                {[messages.sortNewest, messages.sortPopular].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#152033]"
                strokeWidth={2.4}
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {filteredBranches.map((branch) => {
              const isActive = branch.id === activeBranch?.id;

              return (
                <article
                  key={branch.id}
                  onClick={() => {
                    setActiveBranchId(branch.id);
                    setOpenedBranchId(branch.id);
                  }}
                  className={[
                    "flex cursor-pointer items-start gap-4 border-b border-[#f4eee5] px-5 py-6 text-left transition-colors max-[1279px]:gap-3 max-[1279px]:px-4 max-[1279px]:py-4",
                    isActive ? "bg-[#fdfaf5]" : "bg-white",
                  ].join(" ")}
                  style={isActive ? { boxShadow: `inset 3px 0 0 ${branch.themeColor}` } : undefined}
                >
                  <div className="relative h-[112px] w-[112px] shrink-0 overflow-hidden rounded-[16px] max-[1279px]:h-[92px] max-[1279px]:w-[92px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={branch.imageSrc} alt={branch.name} className="h-full w-full object-cover" />
                  </div>

                  <div className="min-w-0 pt-1">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-[16px] font-bold tracking-[-0.05em] text-[#152033] max-[1279px]:text-[15px]">
                        {getBranchDisplayNameWithTranslations(branch, locale, translations)}
                      </h2>
                      <span
                        className={[
                          "inline-flex h-[18px] items-center rounded-full px-[8px] text-[10px] font-bold tracking-[-0.02em]",
                          badgeClassName(branch.badge),
                        ].join(" ")}
                      >
                        {branch.badge}
                      </span>
                    </div>

                    <div className="mt-2 space-y-[7px]">
                      <p className="flex items-start gap-2 text-[11px] leading-[1.5] tracking-[-0.03em] text-[#7b8796] max-[1279px]:text-[10px]">
                        <MapPin className="mt-[1px] h-3 w-3 shrink-0 text-[#b1936e]" strokeWidth={2.1} />
                        <span>{getBranchDisplayAddressWithTranslations(branch, locale, translations)}</span>
                      </p>

                      <p className="flex items-center gap-2 text-[11px] tracking-[-0.03em] text-[#7b8796] max-[1279px]:text-[10px]">
                        <Clock3 className="h-3 w-3 shrink-0 text-[#b1936e]" strokeWidth={2.1} />
                        <span>{getBranchDisplayHours(branch, locale)}</span>
                      </p>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-[6px]">
                      {branch.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex h-[20px] items-center rounded-full bg-[#f3ece6] px-2 text-[10px] font-semibold tracking-[-0.03em] text-[#8a7a77] max-[1279px]:h-[18px] max-[1279px]:text-[9px]"
                        >
                          {getLocalizedHotelCategoryTag(locale, tag)}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}

            {filteredBranches.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <p className="text-[18px] font-bold tracking-[-0.04em] text-[#152033]">
                  {messages.noResultsTitle}
                </p>
                <p className="mt-3 text-[14px] leading-[1.8] tracking-[-0.03em] text-[#8d97a4]">
                  {messages.noResultsDescription}
                </p>
              </div>
            ) : null}
          </div>
        </aside>

        <div
          className={[
            "min-h-0 h-full",
            mobileView === "map" ? "block" : "hidden",
            "xl:block",
          ].join(" ")}
        >
          {activeBranch ? (
            <BranchesMapPanel
              activeBranch={activeBranch}
              activeTags={activeTags}
              branches={branches}
              locale={locale}
              translations={translations}
              onSelectBranch={(branchId) => {
                setActiveBranchId(branchId);
                setOpenedBranchId(branchId);
              }}
              onToggleTag={(tag) => {
                setActiveTags((currentTags) =>
                  currentTags.includes(tag)
                    ? currentTags.filter((currentTag) => currentTag !== tag)
                    : [...currentTags, tag],
                );
              }}
            />
          ) : null}
        </div>
      </div>

      {(openedBranch || isClosing) && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,24,39,0.42)] p-4 xl:p-8 ${isClosing ? "animate-fade-out" : "animate-fade-in"}`}
          onClick={handleClose}
        >
          <div
            className={`${isClosing ? "animate-scale-out" : "animate-scale-in"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {openedBranch &&
              (openedBranch.isOperating ? (
                <BranchDetailsModal
                  key={openedBranch.id}
                  branch={openedBranch}
                  locale={locale}
                  translations={translations}
                  onClose={handleClose}
                />
              ) : (
                <BranchPreparingModal
                  key={openedBranch.id}
                  branch={openedBranch}
                  locale={locale}
                  translations={translations}
                  onClose={handleClose}
                />
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
