"use client";

import { AdminGarosugilLargeImageField } from "@/app/admin/_components/garosugil/editor/AdminGarosugilLargeImageField";
import {
  Field,
  SectionCard,
  TextArea,
  TextInput,
} from "@/app/admin/_components/garosugil/editor/AdminGarosugilFormPrimitives";
import type { GarosugilHeroContent } from "@/lib/garosugil-content";

type AdminGarosugilHeroSectionFormProps = {
  hero: GarosugilHeroContent;
  onChange: (nextHero: GarosugilHeroContent) => void;
  onUploadImage: (file: File) => void;
};

function toLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function AdminGarosugilHeroSectionForm({
  hero,
  onChange,
  onUploadImage,
}: AdminGarosugilHeroSectionFormProps) {
  return (
    <SectionCard
      title="히어로 섹션"
      description="메인 비주얼 문구와 CTA 링크를 한국어/영어로 관리합니다."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="상단 문구 (KR)">
          <TextInput value={hero.eyebrow} onChange={(value) => onChange({ ...hero, eyebrow: value })} />
        </Field>
        <Field label="상단 문구 (EN)">
          <TextInput
            value={hero.eyebrowEn ?? ""}
            onChange={(value) => onChange({ ...hero, eyebrowEn: value })}
          />
        </Field>
      </div>

      <Field label="배지">
        <TextInput value={hero.badge} onChange={(value) => onChange({ ...hero, badge: value })} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="제목 1줄 (KR)">
          <TextInput
            value={hero.title[0] ?? ""}
            onChange={(value) => onChange({ ...hero, title: [value, hero.title[1] ?? ""] })}
          />
        </Field>
        <Field label="제목 1줄 (EN)">
          <TextInput
            value={hero.titleEn?.[0] ?? ""}
            onChange={(value) =>
              onChange({ ...hero, titleEn: [value, hero.titleEn?.[1] ?? ""] })
            }
          />
        </Field>
        <Field label="제목 2줄 (KR)">
          <TextInput
            value={hero.title[1] ?? ""}
            onChange={(value) => onChange({ ...hero, title: [hero.title[0] ?? "", value] })}
          />
        </Field>
        <Field label="제목 2줄 (EN)">
          <TextInput
            value={hero.titleEn?.[1] ?? ""}
            onChange={(value) =>
              onChange({ ...hero, titleEn: [hero.titleEn?.[0] ?? "", value] })
            }
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="설명 문구 (KR)">
          <TextArea
            rows={4}
            value={hero.description.join("\n")}
            onChange={(value) => onChange({ ...hero, description: toLines(value) })}
          />
        </Field>
        <Field label="설명 문구 (EN)">
          <TextArea
            rows={4}
            value={hero.descriptionEn?.join("\n") ?? ""}
            onChange={(value) => onChange({ ...hero, descriptionEn: toLines(value) })}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="예약 링크">
          <TextInput
            value={hero.bookingHref}
            onChange={(value) => onChange({ ...hero, bookingHref: value })}
          />
        </Field>
        <Field label="예약 버튼 문구 (KR)">
          <TextInput
            value={hero.bookingLabel}
            onChange={(value) => onChange({ ...hero, bookingLabel: value })}
          />
        </Field>
        <Field label="지도 링크">
          <TextInput
            value={hero.mapHref}
            onChange={(value) => onChange({ ...hero, mapHref: value })}
          />
        </Field>
        <Field label="예약 버튼 문구 (EN)">
          <TextInput
            value={hero.bookingLabelEn ?? ""}
            onChange={(value) => onChange({ ...hero, bookingLabelEn: value })}
          />
        </Field>
        <Field label="지도 버튼 문구 (KR)">
          <TextInput
            value={hero.mapLabel}
            onChange={(value) => onChange({ ...hero, mapLabel: value })}
          />
        </Field>
        <Field label="지도 버튼 문구 (EN)">
          <TextInput
            value={hero.mapLabelEn ?? ""}
            onChange={(value) => onChange({ ...hero, mapLabelEn: value })}
          />
        </Field>
      </div>

      <AdminGarosugilLargeImageField
        fileInputId="garosugil-hero-image-upload"
        imageUrl={hero.imageSrc}
        label="히어로 이미지"
        previewAlt="히어로 이미지 미리보기"
        onChange={(value) => onChange({ ...hero, imageSrc: value })}
        onUpload={onUploadImage}
      />
    </SectionCard>
  );
}
