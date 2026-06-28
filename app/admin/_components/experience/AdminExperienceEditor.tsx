"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createClientId } from "@/app/admin/_components/hotels/admin-hotels-shared";
import type {
  AdminExperienceCategory,
  AdminExperienceContent,
  AdminExperienceItem,
  AdminExperiencePageSettings,
} from "@/app/admin/_components/experience/admin-experience-shared";
import { ExperienceCategoryForm } from "@/app/admin/_components/experience/editor/ExperienceCategoryForm";
import { ExperienceCategoryList } from "@/app/admin/_components/experience/editor/ExperienceCategoryList";
import { ExperienceEditorSidebar } from "@/app/admin/_components/experience/editor/ExperienceEditorSidebar";
import { ExperienceItemForm } from "@/app/admin/_components/experience/editor/ExperienceItemForm";
import { uploadExperienceImages } from "@/app/admin/_components/experience/editor/experience-editor-storage";
import { AdminSaveDialog } from "@/app/admin/_components/save/AdminSaveDialog";
import { ADMIN_SAVE_REQUEST_EVENT } from "@/app/admin/_components/save/admin-save-events";

function swapItems<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [picked] = nextItems.splice(from, 1);
  nextItems.splice(to, 0, picked);
  return nextItems;
}

type AdminExperienceEditorProps = {
  initialContent: AdminExperienceContent;
};

export function AdminExperienceEditor({ initialContent }: AdminExperienceEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [activeCategoryId, setActiveCategoryId] = useState(initialContent.categories[0]?.id ?? "");
  const [activeItemId, setActiveItemId] = useState(
    initialContent.items.find((item) => item.categoryId === initialContent.categories[0]?.id)?.id ?? "",
  );
  const [imageUploadPending, setImageUploadPending] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [saveResultMessage, setSaveResultMessage] = useState("");
  const [saveResultOpen, setSaveResultOpen] = useState(false);
  const [saveResultVariant, setSaveResultVariant] = useState<"success" | "error">("success");
  const [isPending, startTransition] = useTransition();
  const saveMessageTimerRef = useRef<number | null>(null);
  const saveResultTimerRef = useRef<number | null>(null);

  const activeCategory = useMemo(
    () => content.categories.find((category) => category.id === activeCategoryId) ?? null,
    [activeCategoryId, content.categories],
  );
  const activeItem = useMemo(
    () => content.items.find((item) => item.id === activeItemId) ?? null,
    [activeItemId, content.items],
  );

  function getFirstCategoryItemId(categoryId: string, items: AdminExperienceItem[]) {
    return (
      items
        .filter((item) => item.categoryId === categoryId)
        .sort((a, b) => a.sortOrder - b.sortOrder)[0]?.id ?? ""
    );
  }

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

  function handleSettingsChange<K extends keyof AdminExperiencePageSettings>(
    field: K,
    value: AdminExperiencePageSettings[K],
  ) {
    setContent((current) => ({ ...current, settings: { ...current.settings, [field]: value } }));
  }

  function handleCategoryChange<K extends keyof AdminExperienceCategory>(
    field: K,
    value: AdminExperienceCategory[K],
  ) {
    setContent((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.id === activeCategoryId ? { ...category, [field]: value } : category,
      ),
    }));
  }

  function handleItemChange<K extends keyof AdminExperienceItem>(
    field: K,
    value: AdminExperienceItem[K],
  ) {
    setContent((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === activeItemId ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function toggleCategory(categoryId: string) {
    setContent((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.id === categoryId ? { ...category, isVisible: !category.isVisible } : category,
      ),
    }));
  }

  function toggleItem(itemId: string) {
    setContent((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId ? { ...item, isVisible: !item.isVisible } : item,
      ),
    }));
  }

  function handleCategorySelect(categoryId: string) {
    setActiveCategoryId(categoryId);
    setActiveItemId(getFirstCategoryItemId(categoryId, content.items));
  }

  function handleMoveItem(itemId: string, direction: "up" | "down") {
    setContent((current) => {
      const sameCategoryItems = current.items.filter((item) => item.categoryId === activeCategoryId);
      const index = sameCategoryItems.findIndex((item) => item.id === itemId);

      if (index === -1) {
        return current;
      }

      const reorderedCategoryItems = swapItems(
        sameCategoryItems,
        index,
        direction === "up" ? index - 1 : index + 1,
      );
      const reorderedIds = new Set(reorderedCategoryItems.map((item) => item.id));
      const untouchedItems = current.items.filter((item) => !reorderedIds.has(item.id));

      return {
        ...current,
        items: [
          ...untouchedItems,
          ...reorderedCategoryItems.map((item, itemIndex) => ({
            ...item,
            sortOrder: itemIndex + 1,
          })),
        ],
      };
    });
  }

  function handleAddItem() {
    if (!activeCategoryId) {
      return;
    }

    const nextItemId = createClientId();

    setContent((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: nextItemId,
          categoryId: activeCategoryId,
          titleKo: "새 경험 아이템",
          titleEn: "New Experience Item",
          descriptionKo: "",
          descriptionEn: "",
          imageUrl: "",
          isVisible: true,
          sortOrder:
            current.items.filter((item) => item.categoryId === activeCategoryId).length + 1,
        },
      ],
    }));

    setActiveItemId(nextItemId);
  }

  async function handleUploadImage(file: File) {
    if (!activeItem) {
      return;
    }

    setImageUploadPending(true);

    try {
      const uploadedUrl = await uploadExperienceImages([file]).then((urls) => urls[0]);

      if (!uploadedUrl) {
        throw new Error("EMPTY_UPLOAD_RESULT");
      }

      setContent((current) => ({
        ...current,
        items: current.items.map((item) =>
          item.id === activeItem.id ? { ...item, imageUrl: uploadedUrl } : item,
        ),
      }));

      showSaveMessage("이미지가 업로드되었습니다.");
    } catch {
      showSaveMessage("업로드에 실패했습니다. jpg/png/webp, 2MB 이하만 가능합니다.");
    } finally {
      setImageUploadPending(false);
    }
  }

  function getValidatedContent(): AdminExperienceContent {
    return {
      settings: {
        mainTitleKo: content.settings.mainTitleKo.trim(),
        mainTitleEn: content.settings.mainTitleEn.trim(),
        descriptionKo: content.settings.descriptionKo.trim(),
        descriptionEn: content.settings.descriptionEn.trim(),
      },
      categories: content.categories.map((category, index) => ({
        ...category,
        slug: category.slug.trim() || category.id,
        titleKo: category.titleKo.trim(),
        titleEn: category.titleEn.trim(),
        subtitleKo: category.subtitleKo.trim(),
        subtitleEn: category.subtitleEn.trim(),
        descriptionKo: category.descriptionKo.trim(),
        descriptionEn: category.descriptionEn.trim(),
        sortOrder: index + 1,
      })),
      items: content.items.map((item, index) => ({
        ...item,
        titleKo: item.titleKo.trim(),
        titleEn: item.titleEn.trim(),
        descriptionKo: item.descriptionKo.trim(),
        descriptionEn: item.descriptionEn.trim(),
        imageUrl: item.imageUrl.trim(),
        sortOrder: index + 1,
      })),
    };
  }

  function handleSaveRequestAction() {
    startTransition(() => {
      void (async () => {
        const validatedContent = getValidatedContent();
        const response = await fetch("/api/admin/experience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: validatedContent }),
        });

        if (!response.ok) {
          openSaveResult("저장에 실패했습니다.", "error");
          return;
        }

        setContent(validatedContent);
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
    <div className="mx-auto max-w-[1200px] space-y-6">
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

      {saveMessage ? (
        <div className="rounded-[18px] border border-[#e5dccf] bg-[#fffdf8] px-4 py-3 text-[12px] font-semibold text-[#8b6f47] shadow-sm">
          {saveMessage}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
        <div className="space-y-6">
          <ExperienceEditorSidebar settings={content.settings} onChange={handleSettingsChange} />
          <ExperienceCategoryList
            activeCategoryId={activeCategoryId}
            activeItemId={activeItemId}
            categories={content.categories}
            items={content.items}
            onAddItem={handleAddItem}
            onCategorySelect={handleCategorySelect}
            onItemSelect={setActiveItemId}
            onToggleCategory={toggleCategory}
            onToggleItem={toggleItem}
            onMoveItem={handleMoveItem}
          />
        </div>

        <div className="space-y-6">
          <ExperienceCategoryForm category={activeCategory} onChange={handleCategoryChange} />
          <ExperienceItemForm
            categoryOptions={content.categories}
            imageUploadPending={imageUploadPending}
            item={activeItem}
            onChange={handleItemChange}
            onUploadImage={(file) => {
              void handleUploadImage(file);
            }}
          />
        </div>
      </div>
    </div>
  );
}
