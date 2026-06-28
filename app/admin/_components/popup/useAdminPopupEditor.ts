"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type {
  AdminPopupSettings,
  AdminPopupTargetPage,
} from "@/app/admin/_components/popup/admin-popup-shared";
import { uploadPopupImage } from "@/app/admin/_components/popup/popup-editor-storage";
import { ADMIN_SAVE_REQUEST_EVENT } from "@/app/admin/_components/save/admin-save-events";

export function useAdminPopupEditor(initialSettings: AdminPopupSettings) {
  const [settings, setSettings] = useState(initialSettings);
  const [imageUploadPending, setImageUploadPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [saveResultMessage, setSaveResultMessage] = useState("");
  const [saveResultOpen, setSaveResultOpen] = useState(false);
  const [saveResultVariant, setSaveResultVariant] = useState<"success" | "error">("success");
  const [isPending, startTransition] = useTransition();
  const statusTimerRef = useRef<number | null>(null);
  const resultTimerRef = useRef<number | null>(null);

  function clearStatusMessage() {
    if (statusTimerRef.current) {
      window.clearTimeout(statusTimerRef.current);
      statusTimerRef.current = null;
    }

    setStatusMessage("");
  }

  function showStatusMessage(message: string) {
    clearStatusMessage();
    setStatusMessage(message);
    statusTimerRef.current = window.setTimeout(() => {
      setStatusMessage("");
      statusTimerRef.current = null;
    }, 2400);
  }

  function clearResultTimer() {
    if (resultTimerRef.current) {
      window.clearTimeout(resultTimerRef.current);
      resultTimerRef.current = null;
    }
  }

  function closeSaveResult() {
    clearResultTimer();
    setSaveResultOpen(false);
  }

  function openSaveResult(message: string, variant: "success" | "error") {
    clearResultTimer();
    setSaveResultMessage(message);
    setSaveResultVariant(variant);
    setSaveResultOpen(true);

    if (variant === "success") {
      resultTimerRef.current = window.setTimeout(() => {
        setSaveResultOpen(false);
        resultTimerRef.current = null;
      }, 1800);
    }
  }

  function updateField<K extends keyof AdminPopupSettings>(field: K, value: AdminPopupSettings[K]) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  function toggleTargetPage(targetPage: AdminPopupTargetPage) {
    setSettings((current) => ({
      ...current,
      targetPages: current.targetPages.includes(targetPage)
        ? current.targetPages.filter((page) => page !== targetPage)
        : [...current.targetPages, targetPage],
    }));
  }

  async function handleUploadImage(file: File) {
    setImageUploadPending(true);

    try {
      const uploadedUrl = await uploadPopupImage(file);
      updateField("imageUrl", uploadedUrl);
      showStatusMessage("이미지가 업로드되었습니다.");
    } catch (error) {
      if (error instanceof Error && error.message === "IMAGE_TOO_LARGE") {
        showStatusMessage("업로드에 실패했습니다. 5MB 이하 이미지만 가능합니다.");
      } else {
        showStatusMessage("업로드에 실패했습니다. jpg/png/webp 이미지만 가능합니다.");
      }
    } finally {
      setImageUploadPending(false);
    }
  }

  function getValidatedSettings(): AdminPopupSettings {
    return {
      isVisible: settings.isVisible,
      titleKo: settings.titleKo.trim(),
      titleEn: settings.titleEn.trim(),
      buttonLabelKo: settings.buttonLabelKo.trim(),
      buttonLabelEn: settings.buttonLabelEn.trim(),
      descriptionKo: settings.descriptionKo.trim(),
      descriptionEn: settings.descriptionEn.trim(),
      linkUrl: settings.linkUrl.trim(),
      targetPages: settings.targetPages,
      imageUrl: settings.imageUrl.trim(),
    };
  }

  function handleSaveRequestAction() {
    startTransition(() => {
      void (async () => {
        const validatedSettings = getValidatedSettings();
        const response = await fetch("/api/admin/popup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ settings: validatedSettings }),
        });

        if (!response.ok) {
          openSaveResult("저장에 실패했습니다.", "error");
          return;
        }

        setSettings(validatedSettings);
        openSaveResult("저장이 완료되었습니다.", "success");
      })();
    });
  }

  useEffect(() => {
    const handleSaveRequest = () => {
      setSaveConfirmOpen(true);
    };

    window.addEventListener(ADMIN_SAVE_REQUEST_EVENT, handleSaveRequest);

    return () => {
      window.removeEventListener(ADMIN_SAVE_REQUEST_EVENT, handleSaveRequest);
    };
  }, []);

  useEffect(
    () => () => {
      if (statusTimerRef.current) {
        window.clearTimeout(statusTimerRef.current);
      }

      if (resultTimerRef.current) {
        window.clearTimeout(resultTimerRef.current);
      }
    },
    [],
  );

  return {
    settings,
    imageUploadPending,
    statusMessage,
    saveConfirmOpen,
    saveResultMessage,
    saveResultOpen,
    saveResultVariant,
    isPending,
    updateField,
    toggleTargetPage,
    handleUploadImage,
    closeSaveResult,
    closeSaveConfirm: () => setSaveConfirmOpen(false),
    handleSaveRequestAction,
  };
}
