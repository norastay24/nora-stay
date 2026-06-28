"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

export function CommonHeaderClient({ branches, locale, translations }: CommonHeaderClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [preparingBranch, setPreparingBranch] = useState<BranchItem | null>(null);
  const locations = useMemo(
    () => buildLocationItems(branches, locale, translations),
    [branches, locale, translations],
  );
  const isLocationActive = pathname.startsWith("/locations");
  const isAdminRoute =
    pathname === "/login" || pathname === "/admin" || pathname.startsWith("/admin/");
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

  if (isAdminRoute) {
    return null;
  }

  function handleLocaleChange(nextLocale: AppLocale) {
    if (nextLocale === locale) {
      return;
    }

    setLocaleCookie(nextLocale);
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-50 flex h-20 items-center border-b border-[#f1f1f1] bg-white/90 tracking-tighter backdrop-blur-md">
        <div className="mx-auto grid h-[92px] w-full max-w-[1200px] grid-cols-[auto_1fr_auto] items-center px-2 max-[1280px]:px-6 max-[1024px]:flex max-[1024px]:h-auto max-[1024px]:flex-wrap max-[1024px]:justify-between max-[1024px]:gap-y-4 max-[1024px]:py-5">
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
            className="flex items-center justify-center gap-[42px] justify-self-center max-[1024px]:order-3 max-[1024px]:w-full max-[1024px]:gap-6 max-[640px]:justify-start max-[640px]:gap-[18px] max-[640px]:overflow-x-auto"
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

          <div className="flex items-center gap-[14px] max-[640px]:gap-2.5">
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
        </div>
      </header>

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
