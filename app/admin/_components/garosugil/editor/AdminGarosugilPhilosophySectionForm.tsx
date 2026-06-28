"use client";

import { AdminGarosugilLargeImageField } from "@/app/admin/_components/garosugil/editor/AdminGarosugilLargeImageField";
import {
  Field,
  SectionCard,
  TextArea,
  TextInput,
} from "@/app/admin/_components/garosugil/editor/AdminGarosugilFormPrimitives";
import type { GarosugilPhilosophySectionContent } from "@/lib/garosugil-content";

type AdminGarosugilPhilosophySectionFormProps = {
  philosophy: GarosugilPhilosophySectionContent;
  onChange: (nextPhilosophy: GarosugilPhilosophySectionContent) => void;
  onUploadImage: (file: File) => void;
};

function toLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function AdminGarosugilPhilosophySectionForm({
  philosophy,
  onChange,
  onUploadImage,
}: AdminGarosugilPhilosophySectionFormProps) {
  return (
    <SectionCard
      title="브랜드 철학 섹션"
      description="하단 문구, 이미지, CTA 링크를 한국어/영어로 관리합니다."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="상단 문구 (KR)">
          <TextInput
            value={philosophy.eyebrow}
            onChange={(value) => onChange({ ...philosophy, eyebrow: value })}
          />
        </Field>
        <Field label="상단 문구 (EN)">
          <TextInput
            value={philosophy.eyebrowEn ?? ""}
            onChange={(value) => onChange({ ...philosophy, eyebrowEn: value })}
          />
        </Field>
        <Field label="오버레이 문구 (KR)">
          <TextInput
            value={philosophy.overlayText}
            onChange={(value) => onChange({ ...philosophy, overlayText: value })}
          />
        </Field>
        <Field label="오버레이 문구 (EN)">
          <TextInput
            value={philosophy.overlayTextEn ?? ""}
            onChange={(value) => onChange({ ...philosophy, overlayTextEn: value })}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="제목 1줄 (KR)">
          <TextInput
            value={philosophy.title[0] ?? ""}
            onChange={(value) =>
              onChange({ ...philosophy, title: [value, philosophy.title[1] ?? ""] })
            }
          />
        </Field>
        <Field label="제목 1줄 (EN)">
          <TextInput
            value={philosophy.titleEn?.[0] ?? ""}
            onChange={(value) =>
              onChange({ ...philosophy, titleEn: [value, philosophy.titleEn?.[1] ?? ""] })
            }
          />
        </Field>
        <Field label="제목 2줄 (KR)">
          <TextInput
            value={philosophy.title[1] ?? ""}
            onChange={(value) =>
              onChange({ ...philosophy, title: [philosophy.title[0] ?? "", value] })
            }
          />
        </Field>
        <Field label="제목 2줄 (EN)">
          <TextInput
            value={philosophy.titleEn?.[1] ?? ""}
            onChange={(value) =>
              onChange({ ...philosophy, titleEn: [philosophy.titleEn?.[0] ?? "", value] })
            }
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="설명 문구 (KR)">
          <TextArea
            rows={4}
            value={philosophy.description.join("\n")}
            onChange={(value) => onChange({ ...philosophy, description: toLines(value) })}
          />
        </Field>
        <Field label="설명 문구 (EN)">
          <TextArea
            rows={4}
            value={philosophy.descriptionEn?.join("\n") ?? ""}
            onChange={(value) => onChange({ ...philosophy, descriptionEn: toLines(value) })}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="브랜드 링크">
          <TextInput
            value={philosophy.brandHref}
            onChange={(value) => onChange({ ...philosophy, brandHref: value })}
          />
        </Field>
        <Field label="브랜드 버튼 문구 (KR)">
          <TextInput
            value={philosophy.brandLabel}
            onChange={(value) => onChange({ ...philosophy, brandLabel: value })}
          />
        </Field>
        <Field label="예약 링크">
          <TextInput
            value={philosophy.bookingHref}
            onChange={(value) => onChange({ ...philosophy, bookingHref: value })}
          />
        </Field>
        <Field label="브랜드 버튼 문구 (EN)">
          <TextInput
            value={philosophy.brandLabelEn ?? ""}
            onChange={(value) => onChange({ ...philosophy, brandLabelEn: value })}
          />
        </Field>
        <Field label="예약 버튼 문구 (KR)">
          <TextInput
            value={philosophy.bookingLabel}
            onChange={(value) => onChange({ ...philosophy, bookingLabel: value })}
          />
        </Field>
        <Field label="예약 버튼 문구 (EN)">
          <TextInput
            value={philosophy.bookingLabelEn ?? ""}
            onChange={(value) => onChange({ ...philosophy, bookingLabelEn: value })}
          />
        </Field>
      </div>

      <AdminGarosugilLargeImageField
        fileInputId="garosugil-philosophy-image-upload"
        imageUrl={philosophy.imageSrc}
        label="브랜드 철학 이미지"
        previewAlt="브랜드 철학 이미지 미리보기"
        onChange={(value) => onChange({ ...philosophy, imageSrc: value })}
        onUpload={onUploadImage}
      />
    </SectionCard>
  );
}
