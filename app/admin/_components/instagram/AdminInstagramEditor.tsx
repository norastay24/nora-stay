"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createClientId } from "@/app/admin/_components/hotels/admin-hotels-shared";
import {
  createDefaultInstagramDraft,
  type InstagramDraft,
} from "@/app/admin/_components/instagram/admin-instagram-shared";
import { InstagramImagesSection } from "@/app/admin/_components/instagram/editor/InstagramImagesSection";
import { InstagramEditorSidebar } from "@/app/admin/_components/instagram/editor/InstagramEditorSidebar";
import { InstagramTextSection } from "@/app/admin/_components/instagram/editor/InstagramTextSection";
import { uploadInstagramImages } from "@/app/admin/_components/instagram/editor/instagram-editor-storage";
import { AdminSaveDialog } from "@/app/admin/_components/save/AdminSaveDialog";
import { ADMIN_SAVE_REQUEST_EVENT } from "@/app/admin/_components/save/admin-save-events";

type AdminInstagramEditorProps = {
  initialDraft: InstagramDraft;
};

function swapItems<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [picked] = nextItems.splice(from, 1);
  nextItems.splice(to, 0, picked);
  return nextItems;
}

export function AdminInstagramEditor({ initialDraft }: AdminInstagramEditorProps) {
  const [draft, setDraft] = useState<InstagramDraft>(() => {
    const fallback = createDefaultInstagramDraft();

    return {
      ...fallback,
      ...initialDraft,
      images: initialDraft.images.map((image, index) => ({
        id: image.id || createClientId(),
        url: image.url,
        label: image.label || `Slide #${index + 1}`,
      })),
    };
  });
  const [imageDraftUrl, setImageDraftUrl] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [imageUploadPending, setImageUploadPending] = useState(false);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [saveResultMessage, setSaveResultMessage] = useState("");
  const [saveResultOpen, setSaveResultOpen] = useState(false);
  const [saveResultVariant, setSaveResultVariant] = useState<"success" | "error">("success");
  const [isPending, startTransition] = useTransition();
  const saveMessageTimerRef = useRef<number | null>(null);
  const saveResultTimerRef = useRef<number | null>(null);

  function clearSaveMessage() {
    if (saveMessageTimerRef.current) {
      window.clearTimeout(saveMessageTimerRef.current);
      saveMessageTimerRef.current = null;
    }

    setSaveMessage("");
  }

  function showSaveMessage(message: string) {
    clearSaveMessage();
    setSaveMessage(message);
    saveMessageTimerRef.current = window.setTimeout(() => {
      setSaveMessage("");
      saveMessageTimerRef.current = null;
    }, 3000);
  }

  function clearSaveResultTimer() {
    if (saveResultTimerRef.current) {
      window.clearTimeout(saveResultTimerRef.current);
      saveResultTimerRef.current = null;
    }
  }

  function closeSaveResult() {
    clearSaveResultTimer();
    setSaveResultOpen(false);
  }

  function openSaveResult(message: string, variant: "success" | "error") {
    clearSaveResultTimer();
    setSaveResultMessage(message);
    setSaveResultVariant(variant);
    setSaveResultOpen(true);

    if (variant === "success") {
      saveResultTimerRef.current = window.setTimeout(() => {
        setSaveResultOpen(false);
        saveResultTimerRef.current = null;
      }, 1800);
    }
  }

  function updateField<K extends keyof InstagramDraft>(field: K, value: InstagramDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleAddImage() {
    const nextUrl = imageDraftUrl.trim();

    if (!nextUrl) {
      return;
    }

    setDraft((current) => ({
      ...current,
      images: [
        ...current.images,
        {
          id: createClientId(),
          url: nextUrl,
          label: `Slide #${current.images.length + 1}`,
        },
      ],
    }));
    setImageDraftUrl("");
  }

  async function handleUploadImage(files: File[]) {
    if (files.length === 0) {
      return;
    }

    setImageUploadPending(true);

    try {
      const { uploadedImages, failedCount, failureCodes } = await uploadInstagramImages(
        files,
        draft.images.length,
      );

      setDraft((current) => ({
        ...current,
        images: [...current.images, ...uploadedImages],
      }));

      if (failedCount > 0) {
        if (failureCodes.includes("IMAGE_TOO_LARGE")) {
          showSaveMessage(
            `${uploadedImages.length}장 업로드, ${failedCount}장은 2MB 초과로 제외되었습니다.`,
          );
          return;
        }

        if (failureCodes.includes("INVALID_IMAGE_TYPE")) {
          showSaveMessage(
            `${uploadedImages.length}장 업로드, ${failedCount}장은 jpg/png/webp만 가능합니다.`,
          );
          return;
        }

        showSaveMessage(`${uploadedImages.length}장 업로드, ${failedCount}장은 실패했습니다.`);
        return;
      }

      showSaveMessage(`${uploadedImages.length}장 업로드되었습니다.`);
    } catch {
      showSaveMessage("업로드에 실패했습니다. jpg/png/webp, 2MB 이하만 가능합니다.");
    } finally {
      setImageUploadPending(false);
    }
  }

  function handleMoveImage(imageId: string, direction: "up" | "down") {
    setDraft((current) => {
      const index = current.images.findIndex((image) => image.id === imageId);

      if (index === -1) {
        return current;
      }

      return {
        ...current,
        images: swapItems(
          current.images,
          index,
          direction === "up" ? index - 1 : index + 1,
        ),
      };
    });
  }

  function handleRemoveImage(imageId: string) {
    setDraft((current) => ({
      ...current,
      images: current.images.filter((image) => image.id !== imageId),
    }));
  }

  function getValidatedDraft() {
    return {
      ...draft,
      campaignId: draft.campaignId.trim(),
      buddyLinkKo: draft.buddyLinkKo.trim(),
      buddyLinkEn: draft.buddyLinkEn.trim(),
      footerKo: draft.footerKo.trim(),
      footerEn: draft.footerEn.trim(),
      images: draft.images
        .map((image, index) => ({
          id: image.id || createClientId(),
          url: image.url.trim(),
          label: image.label.trim() || `Slide #${index + 1}`,
        }))
        .filter((image) => image.url.length > 0),
    };
  }

  function handleSaveRequestAction() {
    startTransition(() => {
      void (async () => {
        const validatedDraft = getValidatedDraft();
        const response = await fetch("/api/admin/instagram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ draft: validatedDraft }),
        });

        if (!response.ok) {
          openSaveResult("저장에 실패했습니다.", "error");
          return;
        }

        setDraft(validatedDraft);
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
  });

  useEffect(
    () => () => {
      if (saveMessageTimerRef.current) {
        window.clearTimeout(saveMessageTimerRef.current);
      }

      if (saveResultTimerRef.current) {
        window.clearTimeout(saveResultTimerRef.current);
      }
    },
    [],
  );

  return (
    <div className="mx-auto grid max-w-[1200px] gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
      <AdminSaveDialog
        confirmOpen={saveConfirmOpen}
        isPending={isPending}
        resultMessage={saveResultMessage}
        resultOpen={saveResultOpen}
        resultVariant={saveResultVariant}
        onCancelConfirm={() => setSaveConfirmOpen(false)}
        onCloseResult={closeSaveResult}
        onConfirm={() => {
          setSaveConfirmOpen(false);
          handleSaveRequestAction();
        }}
      />

      <InstagramEditorSidebar />

      <div className="space-y-5">
        {saveMessage ? (
          <div className="rounded-[18px] border border-[#e5dccf] bg-[#fffdf8] px-4 py-3 text-[12px] font-semibold text-[#8b6f47] shadow-sm">
            {saveMessage}
          </div>
        ) : null}

        <InstagramTextSection draft={draft} onFieldChange={updateField} />

        <InstagramImagesSection
          imageDraftUrl={imageDraftUrl}
          imageUploadPending={imageUploadPending}
          images={draft.images}
          onAddImage={handleAddImage}
          onImageDraftUrlChange={setImageDraftUrl}
          onMoveImage={handleMoveImage}
          onRemoveImage={handleRemoveImage}
          onUploadImage={(files) => {
            void handleUploadImage(files);
          }}
        />
      </div>
    </div>
  );
}
