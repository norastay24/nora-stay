"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Menu, Search, X } from "lucide-react";
import type { AdminHotelBranch } from "@/app/admin/_components/hotels/admin-hotels-shared";
import { BranchPreparingModal } from "@/app/branches/_components/BranchPreparingModal";
import {
  buildPreparingBranchItem,
  type BranchItem,
} from "@/app/branches/_components/branches.data";
import {
  APP_LOCALES,
  LOCALE_COOKIE_NAME,
  type AppLocale,
} from "@/lib/i18n";
import { isAdminPublicLoginPath, isAdminPublicPath } from "@/lib/admin-routes";
import { getLocalizedHotelName } from "@/lib/hotel-branch-localization";
import { t, translateDictionaryText, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

type HeaderLocationItem = {
  href: string;
  label: string;
  isOperating: boolean;
  preparingBranch: BranchItem;
};

type CommonHeaderClientProps = {
  branches: AdminHotelBranch[];
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

function resolveLocationHref(branch: AdminHotelBranch) {
  return `/locations/${branch.slug}`;
}

function buildLocationItems(
  branches: AdminHotelBranch[],
  locale: AppLocale,
  translations: TranslationDictionaryMap,
): HeaderLocationItem[] {
  return branches
    .filter((branch) => branch.isVisible && branch.slug)
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((branch) => ({
      href: resolveLocationHref(branch),
      label: translateDictionaryText(
        locale,
        translations,
        branch.name,
        getLocalizedHotelName("en", branch),
      ),
      isOperating: branch.isFeatured,
      preparingBranch: buildPreparingBranchItem(branch),
    }));
}

function setLocaleCookie(nextLocale: AppLocale) {
  document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
  window.localStorage.setItem(LOCALE_COOKIE_NAME, nextLocale);
}

const MOBILE_MENU_STORAGE_KEY = "nora-stay-mobile-menu-open";

export function CommonHeaderClient({ branches, locale, translations }: CommonHeaderClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [preparingBranch, setPreparingBranch] = useState<BranchItem | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locations = useMemo(
    () => buildLocationItems(branches, locale, translations),
    [branches, locale, translations],
  );
  const isLocationActive = pathname.startsWith("/locations");
  const isAdminRoute = isAdminPublicLoginPath(pathname) || isAdminPublicPath(pathname);
  const messages = {
    brandStory: t(locale, translations, "header_brand_story"),
    experience: t(locale, translations, "header_experience"),
    locations: t(locale, translations, "header_locations"),
    findStays: t(locale, translations, "header_find_stays"),
    ready: t(locale, translations, "header_ready"),
    language: t(locale, translations, "header_language"),
  };
  const navItems = [
    { href: "/", label: messages.brandStory },
    { href: "/experience", label: messages.experience },
  ] as const;

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (window.sessionStorage.getItem(MOBILE_MENU_STORAGE_KEY) === "1") {
        setIsMobileMenuOpen(true);
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      window.sessionStorage.removeItem(MOBILE_MENU_STORAGE_KEY);
      document.body.style.overflow = "";
      return;
    }

    window.sessionStorage.setItem(MOBILE_MENU_STORAGE_KEY, "1");
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  function handleLocaleChange(nextLocale: AppLocale) {
    if (nextLocale === locale) {
      return;
    }

    setLocaleCookie(nextLocale);
    router.refresh();
  }

  function handleMobileMenuClose() {
    setIsMobileMenuOpen(false);
  }

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 flex h-20 items-center border-b border-[#f1f1f1] bg-white/90 tracking-tighter backdrop-blur-md">
        <div className="mx-auto grid h-[92px] w-full max-w-[1200px] grid-cols-[auto_1fr_auto] items-center px-2 max-[1280px]:px-6 max-[1024px]:flex max-[1024px]:h-auto max-[1024px]:flex-wrap max-[1024px]:justify-between max-[1024px]:gap-y-4 max-[1024px]:py-6">
          <Link href="/" className="shrink-0" aria-label="Nora Stay">
            <span className="inline-flex items-end gap-[6px] leading-none">
              <Image
                src="/images/nora_logo_black.png"
                alt="nora"
                width={148}
                height={31}
                priority
                className="h-5 w-auto object-contain sm:h-6"
              />
              <span className="relative ml-0.5 mt-1 self-center pb-0.5 text-[10px] font-bold tracking-widest text-[#E1B057] sm:text-xs">
                STAY
                <span
                  className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#E1B057]"
                  aria-hidden="true"
                />
              </span>
            </span>
          </Link>

          <nav
            className="flex items-center justify-center gap-[42px] justify-self-center max-[1024px]:hidden"
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative inline-flex h-[92px] items-center whitespace-nowrap text-[12px] font-bold max-[1024px]:h-10"
                >
                  <span
                    className={[
                      "transition-colors duration-300",
                      isActive ? "text-[#E1B057]" : "text-gray-600 group-hover:text-[#E1B057]",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>
                  {isActive ? (
                    <span
                      className="absolute bottom-[30px] left-0 h-[3px] w-full rounded-full bg-[#E1B057] max-[1024px]:bottom-0"
                      aria-hidden="true"
                    />
                  ) : null}
                </Link>
              );
            })}

            <div className="group relative inline-flex h-[92px] items-center max-[1024px]:h-10">
              <button
                type="button"
                className="inline-flex items-center whitespace-nowrap text-[12px] font-bold"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span
                  className={[
                    "transition-colors duration-300",
                    isLocationActive
                      ? "text-[#E1B057]"
                      : "text-gray-600 group-hover:text-[#E1B057]",
                  ].join(" ")}
                >
                  {messages.locations}
                </span>
                <span
                  className={[
                    "ml-2 text-[13px] leading-none transition-all duration-300 ease-out group-hover:rotate-180",
                    isLocationActive
                      ? "text-[#E1B057]"
                      : "text-gray-400 group-hover:text-[#E1B057]",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  ▼
                </span>
              </button>

              {isLocationActive ? (
                <span
                  className="absolute bottom-[30px] left-0 h-[3px] w-full rounded-full bg-[#E1B057] max-[1024px]:bottom-0"
                  aria-hidden="true"
                />
              ) : null}

              <div className="pointer-events-none absolute left-1/2 top-[calc(100%-12px)] z-30 w-[252px] -translate-x-1/2 translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 max-[640px]:left-0 max-[640px]:w-[236px] max-[640px]:translate-x-0">
                <div className="rounded-[20px] border border-[#e8e0d4] bg-white p-2.5 shadow-[0_16px_32px_rgba(17,17,17,0.10)]">
                  <div className="overflow-hidden rounded-[16px]">
                    {locations.map((location, index) => {
                      const isActive =
                        pathname === location.href || pathname.startsWith(`${location.href}/`);
                      const itemClassName = [
                        "flex w-full items-center justify-between px-5 py-3 text-[13px] font-bold tracking-[-0.03em] transition-all duration-200 hover:rounded-[16px] hover:bg-[#faf9f5]",
                        isActive
                          ? "bg-white text-[#E1B057]"
                          : "bg-white text-[#4b5563] hover:text-[#8d6f35]",
                        index > 0 ? "border-t border-[#f0ede7]" : "",
                      ].join(" ");

                      if (!location.isOperating) {
                        return (
                          <button
                            key={location.href}
                            type="button"
                            onClick={() => setPreparingBranch(location.preparingBranch)}
                            className={itemClassName}
                          >
                            <span>{location.label}</span>
                            <span className="inline-flex rounded-full bg-[#fff1dc] px-2.5 py-1 text-[11px] font-extrabold text-[#f39b12]">
                              {messages.ready}
                            </span>
                          </button>
                        );
                      }

                      return (
                        <Link key={location.href} href={location.href} className={itemClassName}>
                          <span>{location.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-[14px] max-[1024px]:hidden max-[640px]:gap-2.5">
            <div
              className="inline-flex h-[32px] items-center gap-1 rounded-full border border-[#e7e8ec] bg-white p-[3px] text-[12px] font-bold text-[#757b86]"
              aria-label={messages.language}
            >
              {APP_LOCALES.map((option) => {
                const isActive = locale === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleLocaleChange(option)}
                    className={[
                      "inline-flex h-[26px] min-w-[38px] items-center justify-center rounded-full px-3 transition-colors",
                      isActive
                        ? "bg-[#1a1a1a] text-white"
                        : "text-[#757b86] hover:bg-[#f5f5f5]",
                    ].join(" ")}
                  >
                    {option.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <Link
              href="/branches"
              className="inline-flex h-[32px] cursor-pointer items-center gap-[10px] rounded-full border border-[#e7e8ec] bg-white px-[18px] text-[12px] font-semibold text-[#757b86] transition-colors duration-200 hover:border-[#757b86] max-[640px]:px-[14px]"
            >
              <span
                className="relative h-[12px] w-[12px] rounded-full border-2 border-[#9ea3ae] after:absolute after:bottom-[-4px] after:right-[-4px] after:h-[2px] after:w-[6px] after:origin-center after:rotate-45 after:rounded-full after:bg-[#9ea3ae] after:content-['']"
                aria-hidden="true"
              />
              <span>{messages.findStays}</span>
            </Link>
          </div>

          <div className="hidden items-center gap-4 max-[1024px]:flex">
            <Link
              href="/branches"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#1f2937] transition-colors duration-200 hover:text-[#8b6f47]"
              aria-label={messages.findStays}
            >
              <Search className="h-[22px] w-[22px]" strokeWidth={2.05} />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#1f2937] transition-colors duration-200 hover:text-[#8b6f47]"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-header-menu"
            >
              <Menu className="h-[23px] w-[23px]" strokeWidth={2.05} />
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div
          id="mobile-header-menu"
          className="fixed inset-0 z-[60] hidden bg-[rgba(17,17,17,0.14)] text-white max-[1024px]:block"
          style={{ animation: "mobileMenuOverlayIn 220ms ease-out" }}
        >
          <div
            className="flex h-full w-full flex-col bg-[#8b6f47] px-10 pb-8 pt-12 max-[640px]:px-6 max-[640px]:pb-6 max-[640px]:pt-8"
            style={{ animation: "mobileMenuPanelIn 260ms ease-out" }}
          >
            <div className="flex items-start justify-between">
              <Link href="/" className="inline-block">
                <span className="text-[20px] font-extrabold tracking-[0.12em] text-white">
                  NORA STAY
                </span>
              </Link>
              <button
                type="button"
                onClick={handleMobileMenuClose}
                className="inline-flex h-10 w-10 items-center justify-center text-white transition-opacity hover:opacity-70 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-7 w-7" strokeWidth={2.1} />
              </button>
            </div>

            <div className="mt-10 space-y-0 max-[640px]:mt-7">
              {navItems.map((item, index) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <div
                    key={item.href}
                    className={index > 0 ? "border-t border-[rgba(255,255,255,0.12)]" : ""}
                  >
                    <Link
                      href={item.href}
                      onClick={handleMobileMenuClose}
                      className={[
                        "flex items-center justify-between px-4 py-4 max-[640px]:px-3 max-[640px]:py-4",
                        isActive
                          ? "my-2 rounded-[18px] bg-[rgba(255,255,255,0.12)]"
                          : "",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-4 text-[22px] font-bold tracking-[-0.04em] max-[640px]:text-[18px]">
                        <span aria-hidden="true">{index === 0 ? "🏠" : "✨"}</span>
                        <span className={isActive ? "text-white" : "text-white/95"}>{item.label}</span>
                      </span>
                      <ChevronRight className="h-8 w-8 text-white/70 max-[640px]:h-7 max-[640px]:w-7" />
                    </Link>
                  </div>
                );
              })}

              <div className="border-t border-[rgba(255,255,255,0.12)] py-6 max-[640px]:py-5">
                <div className="flex items-center gap-4 text-[22px] font-bold tracking-[-0.04em] text-white/70 max-[640px]:text-[18px]">
                  <span aria-hidden="true">🏢</span>
                  <span>{messages.locations}</span>
                </div>

                <div className="mt-4 space-y-1 pl-[44px] max-[640px]:mt-2 max-[640px]:pl-8">
                  {locations.map((location) => {
                    const isActive =
                      pathname === location.href || pathname.startsWith(`${location.href}/`);

                    if (!location.isOperating) {
                      return (
                        <button
                          key={location.href}
                          type="button"
                          onClick={() => {
                            handleMobileMenuClose();
                            setPreparingBranch(location.preparingBranch);
                          }}
                          className={[
                            "flex w-full items-center justify-between gap-4 px-4 py-3 text-left max-[640px]:px-3 max-[640px]:py-2",
                            isActive
                              ? "my-2 rounded-[18px] bg-[rgba(255,255,255,0.12)]"
                              : "",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "block min-w-0 flex-1 text-[20px] font-bold tracking-[-0.04em] max-[640px]:text-[16px]",
                              isActive ? "text-white" : "text-white/55",
                            ].join(" ")}
                          >
                            {location.label}
                          </span>
                          <span className="inline-flex h-8 items-center rounded-full bg-[#b6881b] px-2 text-[14px] font-bold text-[#ffcf53] max-[640px]:h-7 max-[640px]:px-3 max-[640px]:text-[12px]">
                            PREPARING
                          </span>
                        </button>
                      );
                    }

                    return (
                      <Link
                        key={location.href}
                        href={location.href}
                        onClick={handleMobileMenuClose}
                        className={[
                          "flex w-full items-center justify-between gap-4 px-4 py-3 max-[640px]:px-3 max-[640px]:py-2",
                          isActive
                            ? "my-2 rounded-[18px] bg-[rgba(255,255,255,0.12)]"
                            : "",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "block min-w-0 flex-1 text-[20px] font-bold tracking-[-0.04em] max-[640px]:text-[16px]",
                            isActive ? "text-white" : "text-white/95",
                          ].join(" ")}
                        >
                          {location.label}
                        </span>
                        <span className="inline-flex h-8 items-center rounded-full bg-[#7d9655] px-4 text-[14px] font-bold text-[#00f08a] max-[640px]:h-7 max-[640px]:px-3 max-[640px]:text-[12px]">
                          ACTIVE
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-b border-[rgba(255,255,255,0.12)]">
                {(() => {
                  const isBranchesActive = pathname === "/branches" || pathname.startsWith("/branches/");

                  return (
                    <Link
                      href="/branches"
                      onClick={handleMobileMenuClose}
                      className={[
                        "flex items-center justify-between px-4 py-4 max-[640px]:px-3 max-[640px]:py-4",
                        isBranchesActive
                          ? "my-2 rounded-[18px] bg-[rgba(255,255,255,0.12)]"
                          : "",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-4 text-[22px] font-bold tracking-[-0.04em] max-[640px]:text-[18px]">
                        <Search className="h-7 w-7 max-[640px]:h-6 max-[640px]:w-6" strokeWidth={2.1} />
                        <span>{messages.findStays}</span>
                      </span>
                      <ChevronRight className="h-8 w-8 text-white/70 max-[640px]:h-7 max-[640px]:w-7" />
                    </Link>
                  );
                })()}
              </div>
            </div>

            <div className="mt-auto border-b border-[rgba(255,255,255,0.12)] pb-14 pt-7 max-[640px]:pb-7">
              <div
                className="inline-flex h-[32px] items-center rounded-full border border-[rgba(255,255,255,0.22)] px-4"
                aria-label={messages.language}
              >
                {APP_LOCALES.map((option, index) => {
                  const isActive = locale === option;

                  return (
                    <div key={option} className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleLocaleChange(option)}
                        className={[
                          "text-[14px] font-bold tracking-[0.02em] transition-colors cursor-pointer",
                          isActive ? "text-white" : "text-white/40 hover:text-white",
                        ].join(" ")}
                      >
                        {option.toUpperCase()}
                      </button>
                      {index < APP_LOCALES.length - 1 ? (
                        <span className="mx-3 text-white/30" aria-hidden="true">
                          |
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        @keyframes mobileMenuOverlayIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes mobileMenuPanelIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      {preparingBranch ? (
        <BranchPreparingModal
          branch={preparingBranch}
          locale={locale}
          translations={translations}
          onClose={() => setPreparingBranch(null)}
        />
      ) : null}
    </>
  );
}
