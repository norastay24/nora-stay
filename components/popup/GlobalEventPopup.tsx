"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { AdminPopupSettings } from "@/app/admin/_components/popup/admin-popup-shared";
import { commonMessages, getLocalizedValue, type AppLocale } from "@/lib/i18n";
import { t, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

type GlobalEventPopupProps = {
  settings: AdminPopupSettings;
  locale: AppLocale;
  translations: TranslationDictionaryMap;
};

type TodayDismissStorage = {
  popupKey: string;
  expiresAt: number;
};

const HIDE_STORAGE_KEY = "nora_global_event_popup_hidden";
const SESSION_DISMISS_STORAGE_KEY = "nora_global_event_popup_closed";
const POPUP_STORAGE_EVENT = "nora-global-popup-storage-change";
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
const SERVER_DISMISS_SNAPSHOT = "0:0";
const CLIENT_MOUNTED_SNAPSHOT = true;
const SERVER_MOUNTED_SNAPSHOT = false;

function matchesTargetPage(pathname: string, targetPages: AdminPopupSettings["targetPages"]) {
  return targetPages.some((page) => {
    if (page === "home") {
      return pathname === "/";
    }

    if (page === "branches") {
      return pathname === "/branches" || pathname.startsWith("/branches/");
    }

    if (page === "experience") {
      return pathname === "/experience" || pathname.startsWith("/experience/");
    }

    return false;
  });
}

function getTodayDismissStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(HIDE_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as TodayDismissStorage;
  } catch {
    return null;
  }
}

function hasTodayDismissed(popupKey: string) {
  const stored = getTodayDismissStorage();

  if (!stored) {
    return false;
  }

  if (stored.expiresAt <= Date.now()) {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(HIDE_STORAGE_KEY);
    }

    return false;
  }

  return stored.popupKey === popupKey;
}

function setTodayDismissed(popupKey: string) {
  if (typeof window === "undefined") {
    return;
  }

  const payload: TodayDismissStorage = {
    popupKey,
    expiresAt: Date.now() + ONE_DAY_IN_SECONDS * 1000,
  };

  window.localStorage.setItem(HIDE_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event(POPUP_STORAGE_EVENT));
}

function hasSessionDismissed(popupKey: string) {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(SESSION_DISMISS_STORAGE_KEY) === popupKey;
}

function setSessionDismissed(popupKey: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(SESSION_DISMISS_STORAGE_KEY, popupKey);
  window.dispatchEvent(new Event(POPUP_STORAGE_EVENT));
}

function subscribePopupStorage(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(POPUP_STORAGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(POPUP_STORAGE_EVENT, handleChange);
  };
}

function getDismissSnapshot(popupKey: string, sessionPopupKey: string) {
  return `${hasTodayDismissed(popupKey) ? "1" : "0"}:${hasSessionDismissed(sessionPopupKey) ? "1" : "0"}`;
}

function getServerDismissSnapshot() {
  return SERVER_DISMISS_SNAPSHOT;
}

function subscribeMounted() {
  return () => undefined;
}

function getMountedSnapshot() {
  return CLIENT_MOUNTED_SNAPSHOT;
}

function getServerMountedSnapshot() {
  return SERVER_MOUNTED_SNAPSHOT;
}

export function GlobalEventPopup({ settings, locale, translations }: GlobalEventPopupProps) {
  const pathname = usePathname();
  const router = useRouter();
  const title = getLocalizedValue(locale, settings.titleKo, settings.titleEn);
  const description = getLocalizedValue(locale, settings.descriptionKo, settings.descriptionEn);
  const buttonLabel = getLocalizedValue(locale, settings.buttonLabelKo, settings.buttonLabelEn);
  const messages = {
    grandOpen: t(locale, translations, "popup_grand_open", {
      ko: commonMessages.popup.ko.grandOpen,
      en: commonMessages.popup.en.grandOpen,
    }),
    noImage: t(locale, translations, "popup_no_image", {
      ko: commonMessages.popup.ko.noImage,
      en: commonMessages.popup.en.noImage,
    }),
    dismissToday: t(locale, translations, "popup_dismiss_today", {
      ko: commonMessages.popup.ko.dismissToday,
      en: commonMessages.popup.en.dismissToday,
    }),
    close: t(locale, translations, "popup_close", {
      ko: commonMessages.popup.ko.close,
      en: commonMessages.popup.en.close,
    }),
    imageAlt: t(locale, translations, "popup_image_alt", {
      ko: commonMessages.popup.ko.imageAlt,
      en: commonMessages.popup.en.imageAlt,
    }),
  };
  const popupKey = `${settings.imageUrl}:${settings.titleKo}:${settings.titleEn}:${settings.descriptionKo}:${settings.descriptionEn}:${settings.linkUrl}`;
  const sessionPopupKey = `${pathname}:${popupKey}`;
  const [closedPopupKey, setClosedPopupKey] = useState("");
  const hasMounted = useSyncExternalStore(
    subscribeMounted,
    getMountedSnapshot,
    getServerMountedSnapshot,
  );
  const dismissSnapshot = useSyncExternalStore(
    subscribePopupStorage,
    () => getDismissSnapshot(popupKey, sessionPopupKey),
    getServerDismissSnapshot,
  );
  const isClosedInView = closedPopupKey === sessionPopupKey;
  const [isDismissedForToday, isClosedForSession] = dismissSnapshot.split(":");

  const shouldRender = useMemo(() => {
    if (!settings.isVisible) {
      return false;
    }

    if (!pathname || pathname === "/login" || pathname === "/admin" || pathname.startsWith("/admin/")) {
      return false;
    }

    return matchesTargetPage(pathname, settings.targetPages);
  }, [pathname, settings]);

  if (
    !hasMounted ||
    !shouldRender ||
    isDismissedForToday === "1" ||
    isClosedForSession === "1" ||
    isClosedInView
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(22,24,29,0.55)] p-3 sm:p-5">
      <div className="pointer-events-auto w-full max-w-[520px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_72px_rgba(0,0,0,0.22)] max-[640px]:max-w-[94vw] max-[640px]:rounded-[22px]">
        <div className="relative">
          {settings.imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.imageUrl}
                alt={title || messages.imageAlt}
                className="h-[220px] w-full object-cover sm:h-[360px]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(0,0,0,0.78)] via-[rgba(0,0,0,0.32)] to-transparent px-5 pb-6 pt-12 sm:px-7 sm:pb-6">
                <span className="inline-flex rounded-full bg-[#f0bf57] px-3.5 py-1 text-[10px] font-black tracking-[0.04em] text-[#231c12] max-[640px]:px-3 max-[640px]:text-[9px]">
                  {messages.grandOpen}
                </span>
                <h2 className="text-[20px] font-bold tracking-[-0.05em] text-white sm:text-[26px] max-[640px]:text-[18px]">
                  {title}
                </h2>
              </div>
            </>
          ) : (
            <div className="flex h-[200px] items-center justify-center bg-[#f6f7fa] text-[#9aa4b2] sm:h-[320px] max-[640px]:h-[180px]">
              {messages.noImage}
            </div>
          )}
        </div>

        <div className="px-6 pb-8 pt-7 text-center sm:px-9 sm:pb-9 max-[640px]:px-5 max-[640px]:pb-6 max-[640px]:pt-5">
          <h3 className="text-[16px] font-bold tracking-[-0.04em] text-[#1e2430] sm:text-[20px] max-[640px]:text-[15px]">
            {title}
          </h3>
          <p className="mx-auto mt-4 max-w-[500px] break-keep text-[12px] leading-[1.85] tracking-[-0.04em] text-[#7b8596] sm:text-[13px] max-[640px]:mt-3 max-[640px]:text-[11px]">
            {description}
          </p>

          <button
            type="button"
            onClick={() => {
              setSessionDismissed(sessionPopupKey);
              setClosedPopupKey(sessionPopupKey);

              if (!settings.linkUrl) {
                return;
              }

              if (settings.linkUrl.startsWith("/")) {
                router.push(settings.linkUrl);
                return;
              }

              window.open(settings.linkUrl, "_blank", "noopener,noreferrer");
            }}
            className="mt-8 inline-flex h-[40px] w-full items-center justify-center rounded-full bg-[#9b7c4d] px-8 text-[12px] font-bold tracking-[-0.03em] text-white shadow-sm transition-colors hover:bg-[#87673d] cursor-pointer max-[640px]:mt-6 max-[640px]:h-[38px] max-[640px]:text-[11px]"
          >
            {buttonLabel}
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-[#eef0f4] bg-[#fbfcfe] px-6 py-4 sm:px-8 max-[640px]:px-5 max-[640px]:py-3">
          <button
            type="button"
            onClick={() => {
              setTodayDismissed(popupKey);
              setSessionDismissed(sessionPopupKey);
              setClosedPopupKey(sessionPopupKey);
            }}
            className="text-[12px] font-semibold tracking-[-0.03em] text-[#848d9c] transition-colors hover:text-[#5d6573] max-[640px]:text-[11px]"
          >
            {messages.dismissToday}
          </button>
          <button
            type="button"
            onClick={() => {
              setSessionDismissed(sessionPopupKey);
              setClosedPopupKey(sessionPopupKey);
            }}
            className="text-[12px] font-semibold tracking-[-0.03em] text-[#737b89] transition-colors hover:text-[#1f2937] max-[640px]:text-[11px]"
          >
            {messages.close}
          </button>
        </div>
      </div>
    </div>
  );
}
