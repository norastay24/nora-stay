"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  APP_LOCALES,
  LOCALE_COOKIE_NAME,
  type AppLocale,
} from "@/lib/i18n";
import { t, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

interface IconProps {
  className?: string;
}

type FooterSocialLinks = {
  buddyLinkKo: string;
  buddyLinkEn: string;
};

type CommonFooterProps = {
  locale: AppLocale;
  translations: TranslationDictionaryMap;
  socialLinks: FooterSocialLinks;
};

function InstagramIcon({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function KakaoTalkIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 4.5C7.03 4.5 3 7.66 3 11.56c0 2.52 1.68 4.72 4.2 5.97l-.84 3.09a.47.47 0 0 0 .7.52l3.73-2.45c.4.05.8.08 1.21.08 4.97 0 9-3.16 9-7.05S16.97 4.5 12 4.5Z"
        fill="currentColor"
      />
      <circle cx="9.2" cy="11.6" r="1.05" fill="#232323" />
      <circle cx="12" cy="11.6" r="1.05" fill="#232323" />
      <circle cx="14.8" cy="11.6" r="1.05" fill="#232323" />
    </svg>
  );
}

function setLocaleCookie(nextLocale: AppLocale) {
  document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
  window.localStorage.setItem(LOCALE_COOKIE_NAME, nextLocale);
}

export function CommonFooter({ locale, socialLinks, translations }: CommonFooterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const messages = {
    tagline: t(locale, translations, "footer_tagline"),
    findStays: t(locale, translations, "footer_find_stays"),
    language: t(locale, translations, "footer_language"),
    address: t(locale, translations, "footer_address"),
    inquiry: t(locale, translations, "footer_inquiry"),
    admin: t(locale, translations, "footer_admin"),
    copyright: t(locale, translations, "footer_copyright"),
  };

  if (
    pathname === "/branches" ||
    pathname.startsWith("/branches/") ||
    pathname === "/login" ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  ) {
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
    <footer className="bg-[#181818] text-white">
      <div className="mx-auto max-w-[1200px] px-16 py-20 max-[1024px]:px-10 max-[640px]:px-5 max-[640px]:py-14">
        <div className="flex items-start justify-between gap-10 max-[900px]:flex-col">
          <div>
            <Link href="/" aria-label="Nora Stay" className="inline-flex items-end gap-[6px] leading-none">
              <Image
                src="/images/nora_logo_black.png"
                alt="Nora Stay"
                width={132}
                height={28}
                className="h-[28px] w-auto invert"
              />
              <span className="relative ml-0.5 mt-1 self-center pb-0.5 text-[10px] font-bold tracking-widest text-[#E1B057] sm:text-xs">
                STAY
                <span
                  className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#E1B057]"
                  aria-hidden="true"
                />
              </span>
            </Link>
            <p className="mt-4 text-[12px] font-medium leading-[1.55] tracking-[-0.03em] text-[#6f737a] max-[640px]:text-[11px]">
              {messages.tagline}
            </p>
          </div>

          <div className="flex items-center gap-4 self-start max-[900px]:self-auto max-[640px]:w-full max-[640px]:flex-wrap">
            <div
              className="inline-flex h-[32px] items-center gap-1 rounded-full border border-[#303030] bg-[#222222] p-[3px] text-[13px] font-bold text-[#7f848b]"
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
                      "inline-flex h-[24px] min-w-[36px] items-center justify-center rounded-full px-3 transition-colors",
                      isActive
                        ? "bg-white text-[#1a1a1a]"
                        : "text-[#7f848b] hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    {option.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <Link
              href="/branches"
              className="inline-flex h-[32px] cursor-pointer items-center gap-[10px] rounded-full border border-[#303030] bg-[#222222] px-4 text-[13px] font-bold text-white transition-all duration-200 hover:border-[#6d6d6d] hover:bg-white/15 max-[640px]:justify-center"
            >
              <span
                className="relative h-[13px] w-[13px] rounded-full border-2 border-[#9ea3ae] after:absolute after:bottom-[-4px] after:right-[-4px] after:h-[2px] after:w-[6px] after:origin-center after:rotate-45 after:rounded-full after:bg-[#9ea3ae] after:content-['']"
                aria-hidden="true"
              />
              <span>{messages.findStays}</span>
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-[#272727] pt-8 max-[640px]:mt-8 max-[640px]:pt-6">
          <div className="flex items-start justify-between gap-10 max-[900px]:flex-col">
            <div className="space-y-2 text-[12px] leading-[1.2] tracking-[-0.03em] text-[#7b7f85] max-[640px]:text-[11px]">
              <p>{messages.address}</p>
              <p className="font-semibold text-[#d7a44d]">{messages.inquiry}</p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={socialLinks.buddyLinkEn}
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#363636] bg-[#232323] text-[#8f9399] transition-colors duration-200 hover:text-white"
              >
                <InstagramIcon className="h-6 w-6" />
              </Link>
              <Link
                href={socialLinks.buddyLinkKo}
                aria-label="KakaoTalk"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#363636] bg-[#232323] text-[#8f9399] transition-colors duration-200 hover:text-white"
              >
                <KakaoTalkIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-[#272727] pt-8 max-[640px]:pt-6">
          <div className="flex items-end justify-between gap-10 max-[900px]:flex-col max-[900px]:items-start">
            <div className="space-y-3 text-[12px] leading-[1.2] tracking-[-0.03em] text-[#55585d] max-[640px]:text-[11px]">
              <p>(주) 노라스테이 | 대표 문성호 | 사업자등록번호: 886-81-02339</p>
              <div className="flex items-center gap-3 max-[640px]:flex-wrap max-[640px]:gap-y-2">
                <p>(주) 노라투어 | 대표 문성호 | 사업자등록번호: 363-87-01411</p>
                <span className="max-[640px]:hidden">|</span>
                <Link
                  href="/admin/enter"
                  className="inline-flex h-[26px] items-center rounded-full border border-[#404040] bg-white/5 px-3 text-[12px] font-semibold text-[#9a9da2] transition-all hover:border-white/40 hover:bg-white/15 hover:text-white"
                >
                  {messages.admin}
                </Link>
              </div>
            </div>

            <p className="text-[12px] font-medium tracking-[-0.03em] text-[#55585d] max-[640px]:text-[11px]">
              {messages.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
