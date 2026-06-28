"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { AdminHotelsForm } from "@/app/admin/_components/hotels/AdminHotelsForm";
import { AdminHotelsSidebar } from "@/app/admin/_components/hotels/AdminHotelsSidebar";
import { AdminHotelsSaveNotice } from "@/app/admin/_components/hotels/admin-hotels-form-sections";
import {
  createClientId,
  createEmptyHotelBranch,
  type AdminHotelBranch,
  type HotelCategoryTag,
  type HotelColorTheme,
} from "@/app/admin/_components/hotels/admin-hotels-shared";
import { AdminSaveDialog } from "@/app/admin/_components/save/AdminSaveDialog";
import { ADMIN_SAVE_REQUEST_EVENT } from "@/app/admin/_components/save/admin-save-events";

type AdminHotelsEditorProps = {
  initialBranches: AdminHotelBranch[];
};

const IMAGE_BUCKET_NAME = "hotel-branch-images";
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

function decodeJwtPayload(token: string) {
  const parts = token.split(".");

  if (parts.length < 2) {
    return null;
  }

  try {
    const normalized = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");

    return JSON.parse(window.atob(normalized)) as {
      ref?: string;
    };
  } catch {
    return null;
  }
}

function resolveSupabaseUrl() {
  const directUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (directUrl) {
    return directUrl.startsWith("http://") || directUrl.startsWith("https://")
      ? directUrl
      : `https://${directUrl}.supabase.co`;
  }

  const anonPayload = decodeJwtPayload(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "");

  if (anonPayload?.ref) {
    return `https://${anonPayload.ref}.supabase.co`;
  }

  return null;
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function swapItems<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [picked] = nextItems.splice(from, 1);
  nextItems.splice(to, 0, picked);
  return nextItems;
}

export function AdminHotelsEditor({ initialBranches }: AdminHotelsEditorProps) {
  const [branches, setBranches] = useState(initialBranches);
  const [activeBranchId, setActiveBranchId] = useState(initialBranches[0]?.id ?? "");
  const [imageDraftUrl, setImageDraftUrl] = useState("");
  const [imageUploadPending, setImageUploadPending] = useState(false);
  const [amenityDraft, setAmenityDraft] = useState("");
  const [amenityDraftEn, setAmenityDraftEn] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [saveResultMessage, setSaveResultMessage] = useState("");
  const [saveResultOpen, setSaveResultOpen] = useState(false);
  const [saveResultVariant, setSaveResultVariant] = useState<"success" | "error">("success");
  const [isPending, startTransition] = useTransition();
  const saveMessageTimerRef = useRef<number | null>(null);
  const saveResultTimerRef = useRef<number | null>(null);

  const activeBranch = useMemo(
    () => branches.find((branch) => branch.id === activeBranchId) ?? branches[0] ?? null,
    [activeBranchId, branches],
  );

  function clearSaveMessage() {
    if (saveMessageTimerRef.current) {
      window.clearTimeout(saveMessageTimerRef.current);
      saveMessageTimerRef.current = null;
    }

    setSaveMessage("");
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

  function focusField(field: "name" | "address") {
    const element = document.querySelector<HTMLElement>(`[data-admin-hotel-field="${field}"]`);

    if (!element) {
      return;
    }

    element.focus();
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function getValidatedBranch(branch: AdminHotelBranch) {
    const nextName = branch.name.trim();
    const nextAddress = branch.address.trim();

    if (!nextName) {
      window.alert("지점명을 입력해 주세요.");
      focusField("name");
      return null;
    }

    if (!nextAddress) {
      window.alert("지점 주소를 입력해 주세요.");
      focusField("address");
      return null;
    }

    const nextSlug = branch.slug.trim() || createSlug(nextName) || branch.id;

    return {
      ...branch,
      name: nextName,
      address: nextAddress,
      slug: nextSlug,
    };
  }

  async function handleSaveRequestAction() {
    if (branches.length === 0) {
      return;
    }

    const validatedBranches: AdminHotelBranch[] = [];

    for (const branch of branches) {
      const validatedBranch = getValidatedBranch(branch);

      if (!validatedBranch) {
        if (branch.id !== activeBranchId) {
          setActiveBranchId(branch.id);
          window.setTimeout(() => {
            const focusTarget = branch.name.trim() ? "address" : "name";
            focusField(focusTarget);
          }, 0);
        }
        return;
      }

      validatedBranches.push(validatedBranch);
    }

    startTransition(async () => {
      const response = await fetch("/api/admin/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ branches: validatedBranches }),
      });

      if (!response.ok) {
        openSaveResult("저장에 실패했습니다.", "error");
        return;
      }

      setBranches(validatedBranches);
      openSaveResult("저장이 완료되었습니다.", "success");
    });
  }

  useEffect(() => {
    const handleSaveRequest = () => {
      if (branches.length > 0) {
        setSaveConfirmOpen(true);
      }
    };

    window.addEventListener(ADMIN_SAVE_REQUEST_EVENT, handleSaveRequest);

    return () => {
      window.removeEventListener(ADMIN_SAVE_REQUEST_EVENT, handleSaveRequest);
    };
  }, [branches.length]);

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

  function updateActiveBranch(updater: (branch: AdminHotelBranch) => AdminHotelBranch) {
    setBranches((currentBranches) =>
      currentBranches.map((branch) =>
        branch.id === activeBranchId ? updater(branch) : branch,
      ),
    );
  }

  function handleFieldChange<K extends keyof AdminHotelBranch>(
    field: K,
    value: AdminHotelBranch[K],
  ) {
    updateActiveBranch((branch) => {
      if (field === "name") {
        const nextName = String(value);
        const nextSlug =
          branch.slug && branch.slug.length > 0 ? branch.slug : createSlug(nextName);

        return {
          ...branch,
          name: nextName,
          slug: nextSlug,
        };
      }

      return { ...branch, [field]: value };
    });
  }

  function handleToggleTheme(theme: HotelColorTheme) {
    updateActiveBranch((branch) => ({
      ...branch,
      colorThemes: branch.colorThemes.includes(theme) ? [] : [theme],
    }));
  }

  function handleToggleCategory(tag: HotelCategoryTag) {
    updateActiveBranch((branch) => ({
      ...branch,
      categoryTags: branch.categoryTags.includes(tag)
        ? branch.categoryTags.filter((item) => item !== tag)
        : [...branch.categoryTags, tag],
    }));
  }

  function handleFeatureBadgesChange(value: string) {
    const badges = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    handleFieldChange("featureBadges", badges);
  }

  function handleAddBranch() {
    const nextBranch = createEmptyHotelBranch(branches.length + 1);

    setBranches((currentBranches) => [...currentBranches, nextBranch]);
    setActiveBranchId(nextBranch.id);
    clearSaveMessage();
  }

  async function handleDeleteBranch(branchId: string) {
    const branch = branches.find((item) => item.id === branchId);

    if (!branch) {
      return;
    }

    const confirmed = window.confirm(
      "정말로 이 지점을 삭제하시겠습니까? 관련된 데이터가 모두 삭제됩니다.",
    );

    if (!confirmed) {
      return;
    }

    clearSaveMessage();

    const response = await fetch(`/api/admin/hotels?id=${encodeURIComponent(branchId)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      clearSaveMessage();
      return;
    }

    const nextBranches = branches.filter((item) => item.id !== branchId);
    setBranches(nextBranches);
    setActiveBranchId(nextBranches[0]?.id ?? "");
    clearSaveMessage();
  }

  function handleAddImage() {
    if (!imageDraftUrl.trim()) {
      return;
    }

    updateActiveBranch((branch) => ({
      ...branch,
      images: [
        ...branch.images,
        {
          id: createClientId(),
          url: imageDraftUrl.trim(),
          caption: `이미지 ${branch.images.length + 1}`,
        },
      ],
    }));
    setImageDraftUrl("");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function handleUploadImage(file: File) {
    if (!activeBranch) {
      return;
    }

    if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      clearSaveMessage();
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      clearSaveMessage();
      return;
    }

    const supabaseUrl = resolveSupabaseUrl();
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

    if (!supabaseUrl || !anonKey) {
      clearSaveMessage();
      return;
    }

    const fileExtension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "";
    const safeExtension = fileExtension && /^[a-z0-9]+$/i.test(fileExtension) ? fileExtension : "jpg";
    const branchKey = createSlug(activeBranch.slug || activeBranch.name || activeBranch.id) || activeBranch.id;
    const objectPath = `${branchKey}/${createClientId()}.${safeExtension}`;

    setImageUploadPending(true);
    try {
      const response = await fetch(
        `${supabaseUrl}/storage/v1/object/${IMAGE_BUCKET_NAME}/${objectPath}`,
        {
          method: "POST",
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            "Content-Type": file.type || "application/octet-stream",
            "x-upsert": "true",
          },
          body: file,
        },
      );

      if (!response.ok) {
        clearSaveMessage();
        return;
      }

      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${IMAGE_BUCKET_NAME}/${objectPath}`;

      updateActiveBranch((branch) => ({
        ...branch,
        images: [
          ...branch.images,
          {
            id: createClientId(),
            url: publicUrl,
            caption: `이미지 ${branch.images.length + 1}`,
          },
        ],
      }));
      setImageDraftUrl("");
    } catch {
      clearSaveMessage();
    } finally {
      setImageUploadPending(false);
    }
  }

  async function handleUploadImages(files: File[]) {
    const tempImages = files.map((file, index) => ({
      id: `temp-${createClientId()}`,
      url: URL.createObjectURL(file),
      caption: `이미지 ${(activeBranch?.images.length ?? 0) + index + 1}`,
    }));

    updateActiveBranch((branch) => ({
      ...branch,
      images: [...branch.images, ...tempImages],
    }));

    try {
      for (const [index, file] of files.entries()) {
        if (!activeBranch) {
          return;
        }

        if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
          clearSaveMessage();
          updateActiveBranch((branch) => ({
            ...branch,
            images: branch.images.filter((image) => image.id !== tempImages[index].id),
          }));
          continue;
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
          clearSaveMessage();
          updateActiveBranch((branch) => ({
            ...branch,
            images: branch.images.filter((image) => image.id !== tempImages[index].id),
          }));
          continue;
        }

        const supabaseUrl = resolveSupabaseUrl();
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

        if (!supabaseUrl || !anonKey) {
          clearSaveMessage();
          updateActiveBranch((branch) => ({
            ...branch,
            images: branch.images.filter((image) => image.id !== tempImages[index].id),
          }));
          continue;
        }

        const fileExtension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "";
        const safeExtension =
          fileExtension && /^[a-z0-9]+$/i.test(fileExtension) ? fileExtension : "jpg";
        const branchKey =
          createSlug(activeBranch.slug || activeBranch.name || activeBranch.id) || activeBranch.id;
        const objectPath = `${branchKey}/${createClientId()}.${safeExtension}`;

        setImageUploadPending(true);
        try {
          const response = await fetch(
            `${supabaseUrl}/storage/v1/object/${IMAGE_BUCKET_NAME}/${objectPath}`,
            {
              method: "POST",
              headers: {
                apikey: anonKey,
                Authorization: `Bearer ${anonKey}`,
                "Content-Type": file.type || "application/octet-stream",
                "x-upsert": "true",
              },
              body: file,
            },
          );

          if (!response.ok) {
            clearSaveMessage();
            updateActiveBranch((branch) => ({
              ...branch,
              images: branch.images.filter((image) => image.id !== tempImages[index].id),
            }));
            continue;
          }

          const publicUrl = `${supabaseUrl}/storage/v1/object/public/${IMAGE_BUCKET_NAME}/${objectPath}`;

          updateActiveBranch((branch) => ({
            ...branch,
            images: branch.images.map((image) =>
              image.id === tempImages[index].id ? { ...image, url: publicUrl } : image,
            ),
          }));
          setImageDraftUrl("");
        } catch {
          clearSaveMessage();
          updateActiveBranch((branch) => ({
            ...branch,
            images: branch.images.filter((image) => image.id !== tempImages[index].id),
          }));
        } finally {
          setImageUploadPending(false);
        }
      }
    } finally {
      tempImages.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    }
  }

  function handleUpdateImageCaption(imageId: string, value: string) {
    updateActiveBranch((branch) => ({
      ...branch,
      images: branch.images.map((image) =>
        image.id === imageId ? { ...image, caption: value } : image,
      ),
    }));
  }

  function handleMoveImage(imageId: string, direction: "left" | "right") {
    updateActiveBranch((branch) => {
      const index = branch.images.findIndex((image) => image.id === imageId);

      return {
        ...branch,
        images: swapItems(branch.images, index, direction === "left" ? index - 1 : index + 1),
      };
    });
  }

  function handleRemoveImage(imageId: string) {
    updateActiveBranch((branch) => ({
      ...branch,
      images: branch.images.filter((image) => image.id !== imageId),
    }));
  }

  function handleAddAmenity() {
    if (!amenityDraft.trim()) {
      return;
    }

    updateActiveBranch((branch) => ({
      ...branch,
      amenityNotes: [...branch.amenityNotes, amenityDraft.trim()],
    }));
    setAmenityDraft("");
  }

  function handleAddAmenityEn() {
    if (!amenityDraftEn.trim()) {
      return;
    }

    updateActiveBranch((branch) => ({
      ...branch,
      amenityNotesEn: [...branch.amenityNotesEn, amenityDraftEn.trim()],
    }));
    setAmenityDraftEn("");
  }

  function handleUpdateAmenity(index: number, value: string) {
    updateActiveBranch((branch) => ({
      ...branch,
      amenityNotes: branch.amenityNotes.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  }

  function handleRemoveAmenity(index: number) {
    updateActiveBranch((branch) => ({
      ...branch,
      amenityNotes: branch.amenityNotes.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function handleUpdateAmenityEn(index: number, value: string) {
    updateActiveBranch((branch) => ({
      ...branch,
      amenityNotesEn: branch.amenityNotesEn.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  }

  function handleRemoveAmenityEn(index: number) {
    updateActiveBranch((branch) => ({
      ...branch,
      amenityNotesEn: branch.amenityNotesEn.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  return (
    <div className="mx-auto grid w-full max-w-[1200px] items-start gap-6 xl:grid-cols-[minmax(0,400px)_minmax(0,800px)]">
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
          void handleSaveRequestAction();
        }}
      />

      <AdminHotelsSidebar
        branches={branches}
        activeBranchId={activeBranch?.id ?? ""}
        onSelectBranch={setActiveBranchId}
        onAddBranch={handleAddBranch}
        onDeleteBranch={handleDeleteBranch}
      />

      {activeBranch ? (
        <div className="w-full max-w-[800px] space-y-3">
          {saveMessage ? (
            <AdminHotelsSaveNotice savePending={false} saveMessage={saveMessage} />
          ) : null}
          <AdminHotelsForm
            branch={activeBranch}
            imageDraftUrl={imageDraftUrl}
            imageUploadPending={imageUploadPending}
            amenityDraft={amenityDraft}
            amenityDraftEn={amenityDraftEn}
            onFieldChange={handleFieldChange}
            onToggleTheme={handleToggleTheme}
            onToggleCategory={handleToggleCategory}
            onFeatureBadgesChange={handleFeatureBadgesChange}
            onImageDraftChange={setImageDraftUrl}
            onAddImage={handleAddImage}
            onUploadImage={handleUploadImages}
            onUpdateImageCaption={handleUpdateImageCaption}
            onMoveImage={handleMoveImage}
            onRemoveImage={handleRemoveImage}
            onAmenityDraftChange={setAmenityDraft}
            onAmenityDraftEnChange={setAmenityDraftEn}
            onAddAmenity={handleAddAmenity}
            onAddAmenityEn={handleAddAmenityEn}
            onUpdateAmenity={handleUpdateAmenity}
            onUpdateAmenityEn={handleUpdateAmenityEn}
            onRemoveAmenity={handleRemoveAmenity}
            onRemoveAmenityEn={handleRemoveAmenityEn}
          />
        </div>
      ) : (
        <section className="flex min-h-[480px] w-full max-w-[800px] items-center justify-center rounded-[22px] border border-[#e8e2d9] bg-white shadow-sm">
          <div className="text-center">
            <p className="mt-3 text-[18px] font-black tracking-[-0.04em] text-[#1b2432]">
              현재 등록된 지점이 없습니다.
            </p>
            <p className="mt-2 text-[13px] text-[#8a94a3]">좌측 상단 `추가` 버튼으로 새 지점을 만들 수 있습니다.</p>
          </div>
        </section>
      )}
    </div>
  );
}
