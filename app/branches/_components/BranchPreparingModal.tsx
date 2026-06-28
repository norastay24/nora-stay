"use client";

import { CalendarDays, Sparkles, X } from "lucide-react";
import {
  getBranchDisplayNameWithTranslations,
  type BranchItem,
} from "@/app/branches/_components/branches.data";
import { commonMessages, type AppLocale } from "@/lib/i18n";
import { t, type TranslationDictionaryMap } from "@/lib/translation-dictionary";

type BranchPreparingModalProps = {
  branch: BranchItem;
  locale?: AppLocale;
  translations?: TranslationDictionaryMap;
  onClose: () => void;
};

export function BranchPreparingModal({
  branch,
  locale = "ko",
  translations = {},
  onClose,
}: BranchPreparingModalProps) {
  const messages = {
    titleSuffix: t(locale, translations, "preparing_modal_title_suffix", {
      ko: commonMessages.preparingModal.ko.titleSuffix,
      en: commonMessages.preparingModal.en.titleSuffix,
    }),
    subtitleSuffix: t(locale, translations, "preparing_modal_subtitle_suffix", {
      ko: commonMessages.preparingModal.ko.subtitleSuffix,
      en: commonMessages.preparingModal.en.subtitleSuffix,
    }),
    infoLabel: t(locale, translations, "preparing_modal_info_label", {
      ko: commonMessages.preparingModal.ko.infoLabel,
      en: commonMessages.preparingModal.en.infoLabel,
    }),
    bodyPrefix: t(locale, translations, "preparing_modal_body_prefix", {
      ko: commonMessages.preparingModal.ko.bodyPrefix,
      en: commonMessages.preparingModal.en.bodyPrefix,
    }),
    bodySuffix: t(locale, translations, "preparing_modal_body_suffix", {
      ko: commonMessages.preparingModal.ko.bodySuffix,
      en: commonMessages.preparingModal.en.bodySuffix,
    }),
    confirm: t(locale, translations, "preparing_modal_confirm", {
      ko: commonMessages.preparingModal.ko.confirm,
      en: commonMessages.preparingModal.en.confirm,
    }),
  };
  const branchName = getBranchDisplayNameWithTranslations(branch, locale, translations);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,24,39,0.42)] p-4 max-[767px]:overflow-y-auto max-[767px]:px-4 max-[767px]:py-9"
      onClick={onClose}
    >
      <div
        className="relative mx-auto w-full max-w-[700px] overflow-hidden rounded-[24px] bg-white shadow-xl max-[767px]:max-w-[calc(100vw-44px)] max-[767px]:rounded-[28px]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 max-[767px]:right-6 max-[767px]:top-6 max-[767px]:h-10 max-[767px]:w-10"
        >
          <X className="h-4 w-4 max-[767px]:h-5 max-[767px]:w-5" />
        </button>

        <div className="bg-[#9c7b4b] px-6 py-7 text-center text-white max-[767px]:px-6 max-[767px]:pb-12 max-[767px]:pt-14">
          <h2 className="text-[16px] font-bold tracking-[0.15em] max-[767px]:text-[17px]">
            NORA <span className="text-[#f3c24f]">STAY</span>
          </h2>
          <p className="mt-0.5 text-[10px] font-medium tracking-[0.08em] text-white/80 max-[767px]:mt-1 max-[767px]:text-[11px]">
            PREMIUM BOUTIQUE STAY
          </p>
        </div>

        <div className="grid gap-6 px-8 py-8 md:grid-cols-[180px_minmax(0,1fr)] md:items-start max-[767px]:gap-5 max-[767px]:px-5 max-[767px]:pb-7 max-[767px]:pt-0">
          <div className="max-[767px]:-mt-8 max-[767px]:flex max-[767px]:flex-col max-[767px]:items-center max-[767px]:text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-[#efe9df] bg-[#faf8f4] max-[767px]:h-[74px] max-[767px]:w-[74px] max-[767px]:rounded-[22px] max-[767px]:shadow-[0_6px_18px_rgba(21,32,51,0.08)]">
              <CalendarDays className="h-6 w-6 text-[#9c7b4b] max-[767px]:h-8 max-[767px]:w-8" strokeWidth={1.5} />
            </div>
            <h3 className="mt-4 text-[18px] font-bold tracking-[-0.03em] text-[#152033] max-[767px]:mt-5 max-[767px]:text-[16px]">
              {branchName} {messages.titleSuffix}
            </h3>
            <p className="mt-1 text-[13px] tracking-[-0.02em] text-[#9aa4b2] max-[767px]:mx-auto max-[767px]:max-w-[280px] max-[767px]:text-[12px] max-[767px]:leading-[1.55]">
              {branchName} {messages.subtitleSuffix}
            </p>
          </div>

          <div>
            <div className="rounded-[16px] bg-[#faf8f4] px-5 py-4 max-[767px]:rounded-[20px] max-[767px]:px-6 max-[767px]:py-5">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#9c7b4b] max-[767px]:text-[12px]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{messages.infoLabel}</span>
              </div>
              <p className="mt-2 text-[13px] leading-[1.6] tracking-[-0.02em] text-[#7b8796] max-[767px]:text-[12px] max-[767px]:leading-[1.7]">
                {messages.bodyPrefix}
                {branchName}
                {messages.bodySuffix}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 inline-flex h-[44px] w-full items-center justify-center rounded-[12px] bg-[#9c7b4b] text-[14px] font-bold text-white transition-colors hover:bg-[#8b6f47] max-[767px]:mt-6 max-[767px]:h-[40px] max-[767px]:rounded-full max-[767px]:text-[12px]"
            >
              {messages.confirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
