"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { AdminSaveDialog } from "@/app/admin/_components/save/AdminSaveDialog";
import { ADMIN_SAVE_REQUEST_EVENT } from "@/app/admin/_components/save/admin-save-events";
import { AdminGarosugilCollectionsSectionForm } from "@/app/admin/_components/garosugil/editor/AdminGarosugilCollectionsSectionForm";
import { AdminGarosugilGallerySectionForm } from "@/app/admin/_components/garosugil/editor/AdminGarosugilGallerySectionForm";
import { AdminGarosugilHeroSectionForm } from "@/app/admin/_components/garosugil/editor/AdminGarosugilHeroSectionForm";
import { AdminGarosugilPhilosophySectionForm } from "@/app/admin/_components/garosugil/editor/AdminGarosugilPhilosophySectionForm";
import { uploadGarosugilImage } from "@/app/admin/_components/garosugil/editor/admin-garosugil-storage";
import type { GarosugilContent } from "@/lib/garosugil-content";

type AdminGarosugilEditorProps = {
  initialDraft: GarosugilContent;
  locationSlug?: string;
};

const editorSections = [
  { id: "hero", label: "히어로" },
  { id: "gallery", label: "갤러리" },
  { id: "specs", label: "기본 정보" },
  { id: "floorGuide", label: "층별 안내" },
  { id: "roomCategories", label: "객실" },
  { id: "moments", label: "모먼트" },
  { id: "philosophy", label: "브랜드 철학" },
] as const;

type EditorSectionId = (typeof editorSections)[number]["id"];

export function AdminGarosugilEditor({
  initialDraft,
  locationSlug = "garosugil",
}: AdminGarosugilEditorProps) {
  const [draft, setDraft] = useState<GarosugilContent>(initialDraft);
  const [activeSection, setActiveSection] = useState<EditorSectionId>("hero");
  const [saveMessage, setSaveMessage] = useState("");
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [saveResultOpen, setSaveResultOpen] = useState(false);
  const [saveResultMessage, setSaveResultMessage] = useState("");
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

  async function handleUpload(file: File, folder: string, onUploaded: (url: string) => void) {
    try {
      const url = await uploadGarosugilImage(file, folder);
      onUploaded(url);
      showSaveMessage("이미지를 업로드했습니다.");
    } catch (error) {
      if (error instanceof Error && error.message === "IMAGE_TOO_LARGE") {
        showSaveMessage("업로드에 실패했습니다. 이미지 최대 용량은 5MB입니다.");
        return;
      }

      if (error instanceof Error && error.message === "INVALID_IMAGE_TYPE") {
        showSaveMessage("업로드에 실패했습니다. jpg, png, webp, gif만 가능합니다.");
        return;
      }

      showSaveMessage("업로드에 실패했습니다.");
    }
  }

  function closeSaveResult() {
    clearSaveResultTimer();
    setSaveResultOpen(false);
  }

  function handleSaveRequestAction() {
    startTransition(() => {
      void (async () => {
        const response = await fetch(`/api/admin/locations/${locationSlug}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ draft }),
        });

        if (!response.ok) {
          openSaveResult("저장에 실패했습니다.", "error");
          return;
        }

        openSaveResult("저장되었습니다.", "success");
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
    <div className="mx-auto max-w-[1200px]">
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

      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-[96px] lg:self-start">
          <div className="rounded-[24px] border border-gray-100 bg-white p-3 shadow-sm lg:p-4">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {editorSections.map((section) => {
                const isActive = section.id === activeSection;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={[
                      "min-w-fit rounded-full border px-4 py-2 text-[12px] font-bold tracking-[-0.03em] transition-all duration-200 lg:w-full lg:rounded-[18px] lg:px-4 lg:py-3 lg:text-left",
                      isActive
                        ? "border-[#9f7b47] bg-[#9f7b47] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                        : "border-transparent bg-transparent text-[#69758a] hover:bg-[#f9fafb] hover:text-[#000]",
                    ].join(" ")}
                  >
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          {saveMessage ? (
            <div className="rounded-[18px] border border-[#e5dccf] bg-[#fffdf8] px-4 py-3 text-[12px] font-semibold text-[#8b6f47] shadow-sm">
              {saveMessage}
            </div>
          ) : null}

          {activeSection === "hero" ? (
            <AdminGarosugilHeroSectionForm
              hero={draft.hero}
              onChange={(hero) => setDraft((current) => ({ ...current, hero }))}
              onUploadImage={(file) =>
                void handleUpload(file, "hero", (url) =>
                  setDraft((current) => ({ ...current, hero: { ...current.hero, imageSrc: url } })),
                )
              }
            />
          ) : null}

          {activeSection === "gallery" ? (
            <AdminGarosugilGallerySectionForm
              gallery={draft.gallery}
              onChange={(gallery) => setDraft((current) => ({ ...current, gallery }))}
              onUploadImage={(file, categoryId, slideId) =>
                void handleUpload(file, "gallery", (url) =>
                  setDraft((current) => ({
                    ...current,
                    gallery: {
                      ...current.gallery,
                      categories: current.gallery.categories.map((category) =>
                        category.id === categoryId
                          ? {
                              ...category,
                              slides: category.slides.map((slide) =>
                                slide.id === slideId ? { ...slide, imageSrc: url } : slide,
                              ),
                            }
                          : category,
                      ),
                    },
                  })),
                )
              }
            />
          ) : null}

          {activeSection === "specs" ||
          activeSection === "floorGuide" ||
          activeSection === "roomCategories" ||
          activeSection === "moments" ? (
            <AdminGarosugilCollectionsSectionForm
              content={draft}
              section={activeSection}
              onChange={setDraft}
              onUploadFloorImage={(file, cardId) =>
                void handleUpload(file, "floor-guide", (url) =>
                  setDraft((current) => ({
                    ...current,
                    floorGuide: {
                      ...current.floorGuide,
                      cards: current.floorGuide.cards.map((card) =>
                        card.id === cardId ? { ...card, imageSrc: url } : card,
                      ),
                    },
                  })),
                )
              }
              onUploadRoomImage={(file, roomId) =>
                void handleUpload(file, "rooms", (url) =>
                  setDraft((current) => ({
                    ...current,
                    roomCategories: {
                      ...current.roomCategories,
                      items: current.roomCategories.items.map((room) =>
                        room.id === roomId ? { ...room, imageSrc: url } : room,
                      ),
                    },
                  })),
                )
              }
            />
          ) : null}

          {activeSection === "philosophy" ? (
            <AdminGarosugilPhilosophySectionForm
              philosophy={draft.philosophy}
              onChange={(philosophy) => setDraft((current) => ({ ...current, philosophy }))}
              onUploadImage={(file) =>
                void handleUpload(file, "philosophy", (url) =>
                  setDraft((current) => ({
                    ...current,
                    philosophy: { ...current.philosophy, imageSrc: url },
                  })),
                )
              }
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
