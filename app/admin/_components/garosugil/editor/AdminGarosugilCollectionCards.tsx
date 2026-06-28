"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Images, Pencil, X } from "lucide-react";
import {
  ActionButton,
  Field,
  TextArea,
  TextInput,
} from "@/app/admin/_components/garosugil/editor/AdminGarosugilFormPrimitives";
import type { GarosugilFloorGuideCard, GarosugilRoomCategory } from "@/lib/garosugil-content";

type TextEditorField = {
  key: string;
  label: string;
  value: string;
  rows?: number;
};

type TextEditorDialogState = {
  title: string;
  description?: string;
  fields: TextEditorField[];
  onSave: (values: Record<string, string>) => void;
} | null;

export function SectionCopyFields({
  eyebrow,
  eyebrowEn,
  title,
  titleEn,
  description,
  descriptionEn,
  onEyebrowChange,
  onEyebrowEnChange,
  onTitleChange,
  onTitleEnChange,
  onDescriptionChange,
  onDescriptionEnChange,
}: {
  eyebrow: string;
  eyebrowEn?: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  onEyebrowChange: (value: string) => void;
  onEyebrowEnChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onTitleEnChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDescriptionEnChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="상단 문구 (KR)">
        <TextInput value={eyebrow} onChange={onEyebrowChange} />
      </Field>
      <Field label="상단 문구 (EN)">
        <TextInput value={eyebrowEn ?? ""} onChange={onEyebrowEnChange} />
      </Field>
      <Field label="제목 (KR)">
        <TextInput value={title} onChange={onTitleChange} />
      </Field>
      <Field label="제목 (EN)">
        <TextInput value={titleEn ?? ""} onChange={onTitleEnChange} />
      </Field>
      <div className="md:col-span-2">
        <Field label="설명 (KR)">
          <TextArea rows={3} value={description} onChange={onDescriptionChange} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="설명 (EN)">
          <TextArea rows={3} value={descriptionEn ?? ""} onChange={onDescriptionEnChange} />
        </Field>
      </div>
    </div>
  );
}

function ImageUploadField({
  inputId,
  value,
  label,
  onChange,
  onUpload,
}: {
  inputId: string;
  value: string;
  label: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="space-y-2">
      <Field label={label}>
        <TextInput value={value} onChange={onChange} placeholder="https://..." />
      </Field>
      <input
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (!file) {
            return;
          }

          onUpload(file);
          event.target.value = "";
        }}
      />
      <label
        htmlFor={inputId}
        className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-2 text-center text-xs font-bold text-gray-600 transition-all hover:border-[#8B6F47] hover:text-[#8B6F47]"
      >
        파일 업로드
      </label>
    </div>
  );
}

function CardTextDialog({
  state,
  onClose,
}: {
  state: Exclude<TextEditorDialogState, null>;
  onClose: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    state.fields.reduce<Record<string, string>>((acc, field) => {
      acc[field.key] = field.value;
      return acc;
    }, {}),
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2f2418]/28 px-4">
      <div className="w-full max-w-2xl rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-[0_24px_80px_rgba(79,58,31,0.18)] sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-extrabold tracking-[-0.03em] text-[#2f2418]">
              {state.title}
            </h3>
            {state.description ? (
              <p className="mt-1 text-xs leading-6 text-gray-500">{state.description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
            title="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {state.fields.map((field) => (
            <Field key={field.key} label={field.label}>
              {field.rows && field.rows > 1 ? (
                <TextArea
                  rows={field.rows}
                  value={values[field.key] ?? ""}
                  onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))}
                />
              ) : (
                <TextInput
                  value={values[field.key] ?? ""}
                  onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))}
                />
              )}
            </Field>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-w-24 items-center justify-center rounded-full border border-[#e6dccd] px-4 py-2 text-sm font-bold text-[#7b6a55] transition-colors hover:bg-[#f7f2ea]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => {
              state.onSave(values);
              onClose();
            }}
            className="inline-flex min-w-24 items-center justify-center rounded-full bg-[#8b6f47] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#745a37]"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
}

function CompactPreview({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="space-y-0.5">
      <span className="block truncate text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8b6f47]">
        {eyebrow || "상단 문구"}
      </span>
      <h4 className="truncate text-sm font-extrabold text-gray-900">{title || "제목"}</h4>
    </div>
  );
}

function toLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function FloorGuideManager({
  cards,
  onChangeCard,
  onUploadImage,
}: {
  cards: GarosugilFloorGuideCard[];
  onChangeCard: (
    cardId: string,
    updater: (card: GarosugilFloorGuideCard) => GarosugilFloorGuideCard,
  ) => void;
  onUploadImage: (file: File, cardId: string) => void;
}) {
  const [dialogState, setDialogState] = useState<TextEditorDialogState>(null);

  return (
    <>
      {dialogState ? <CardTextDialog state={dialogState} onClose={() => setDialogState(null)} /> : null}

      <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Images className="h-5 w-5 text-[#8B6F47]" />
            <div>
              <h3 className="text-base font-extrabold text-gray-900">층별안내 카드 사진 관리</h3>
              <p className="mt-1 text-xs text-gray-500">
                층별안내 카드 문구는 팝업에서 한국어/영어로 수정합니다.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-400">{cards.length}개 카드</span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative h-36 w-full overflow-hidden bg-gray-50">
                {card.imageSrc ? (
                  <Image
                    src={card.imageSrc}
                    alt={card.imageAlt || card.title || `층별안내 카드 ${index + 1}`}
                    fill
                    unoptimized
                    sizes="(max-width: 1279px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-300">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
                <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                  카드 #{index + 1}
                </div>
                <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-[#6c5740] backdrop-blur-sm">
                  {card.size === "wide" ? "와이드" : "기본"}
                </div>
              </div>

              <div className="space-y-2 p-2.5">
                <CompactPreview eyebrow={card.eyebrow} title={card.title} />

                <div className="border-t border-gray-100 pt-2">
                  <div className="flex items-end gap-2">
                    <div className="min-w-0 flex-1">
                      <ImageUploadField
                        inputId={`floor-guide-image-${card.id}`}
                        label="이미지 URL"
                        value={card.imageSrc}
                        onChange={(imageSrc) =>
                          onChangeCard(card.id, (current) => ({ ...current, imageSrc }))
                        }
                        onUpload={(file) => onUploadImage(file, card.id)}
                      />
                    </div>
                    <ActionButton
                      variant="subtle"
                      className="mb-0.5 shrink-0 px-3"
                      onClick={() =>
                        setDialogState({
                          title: `층별안내 카드 #${index + 1} 문구 편집`,
                          description: "이 카드의 한국어/영어 문구를 수정합니다.",
                          fields: [
                            { key: "eyebrow", label: "상단 문구 (KR)", value: card.eyebrow },
                            { key: "eyebrowEn", label: "상단 문구 (EN)", value: card.eyebrowEn ?? "" },
                            { key: "title", label: "제목 (KR)", value: card.title },
                            { key: "titleEn", label: "제목 (EN)", value: card.titleEn ?? "" },
                            { key: "description", label: "설명 (KR)", value: card.description.join("\n"), rows: 5 },
                            { key: "descriptionEn", label: "설명 (EN)", value: card.descriptionEn?.join("\n") ?? "", rows: 5 },
                          ],
                          onSave: (values) =>
                            onChangeCard(card.id, (current) => ({
                              ...current,
                              eyebrow: values.eyebrow ?? "",
                              eyebrowEn: values.eyebrowEn ?? "",
                              title: values.title ?? "",
                              titleEn: values.titleEn ?? "",
                              description: toLines(values.description ?? ""),
                              descriptionEn: toLines(values.descriptionEn ?? ""),
                            })),
                        })
                      }
                    >
                      <Pencil className="mr-1 h-3.5 w-3.5" />
                      문구
                    </ActionButton>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

export function RoomCategoriesManager({
  items,
  onChangeRoom,
  onUploadImage,
}: {
  items: GarosugilRoomCategory[];
  onChangeRoom: (
    roomId: string,
    updater: (room: GarosugilRoomCategory) => GarosugilRoomCategory,
  ) => void;
  onUploadImage: (file: File, roomId: string) => void;
}) {
  const [dialogState, setDialogState] = useState<TextEditorDialogState>(null);

  return (
    <>
      {dialogState ? <CardTextDialog state={dialogState} onClose={() => setDialogState(null)} /> : null}

      <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Images className="h-5 w-5 text-[#8B6F47]" />
            <div>
              <h3 className="text-base font-extrabold text-gray-900">객실 카드 사진 관리</h3>
              <p className="mt-1 text-xs text-gray-500">
                객실 카드 문구는 팝업에서 한국어/영어로 수정합니다.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-400">{items.length}개 객실</span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {items.map((room, index) => (
            <article
              key={room.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative h-36 w-full overflow-hidden bg-gray-50">
                {room.imageSrc ? (
                  <Image
                    src={room.imageSrc}
                    alt={room.imageAlt || room.title || `객실 ${index + 1}`}
                    fill
                    unoptimized
                    sizes="(max-width: 1279px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-300">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
                <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                  객실 #{index + 1}
                </div>
              </div>

              <div className="space-y-2 p-2.5">
                <CompactPreview eyebrow={room.eyebrow} title={room.title} />

                <div className="border-t border-gray-100 pt-2">
                  <div className="flex items-end gap-2">
                    <div className="min-w-0 flex-1">
                      <ImageUploadField
                        inputId={`room-image-${room.id}`}
                        label="이미지 URL"
                        value={room.imageSrc}
                        onChange={(imageSrc) =>
                          onChangeRoom(room.id, (current) => ({ ...current, imageSrc }))
                        }
                        onUpload={(file) => onUploadImage(file, room.id)}
                      />
                    </div>
                    <ActionButton
                      variant="subtle"
                      className="mb-0.5 shrink-0 px-3"
                      onClick={() =>
                        setDialogState({
                          title: `객실 #${index + 1} 문구 편집`,
                          description: "이 객실 카드의 한국어/영어 문구를 수정합니다.",
                          fields: [
                            { key: "eyebrow", label: "상단 문구 (KR)", value: room.eyebrow },
                            { key: "eyebrowEn", label: "상단 문구 (EN)", value: room.eyebrowEn ?? "" },
                            { key: "title", label: "제목 (KR)", value: room.title },
                            { key: "titleEn", label: "제목 (EN)", value: room.titleEn ?? "" },
                            { key: "description", label: "설명 (KR)", value: room.description.join("\n"), rows: 5 },
                            { key: "descriptionEn", label: "설명 (EN)", value: room.descriptionEn?.join("\n") ?? "", rows: 5 },
                          ],
                          onSave: (values) =>
                            onChangeRoom(room.id, (current) => ({
                              ...current,
                              eyebrow: values.eyebrow ?? "",
                              eyebrowEn: values.eyebrowEn ?? "",
                              title: values.title ?? "",
                              titleEn: values.titleEn ?? "",
                              description: toLines(values.description ?? ""),
                              descriptionEn: toLines(values.descriptionEn ?? ""),
                            })),
                        })
                      }
                    >
                      <Pencil className="mr-1 h-3.5 w-3.5" />
                      문구
                    </ActionButton>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
