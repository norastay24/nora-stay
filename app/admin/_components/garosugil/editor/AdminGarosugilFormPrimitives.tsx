"use client";

import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

type FieldProps = {
  label: string;
  children: ReactNode;
};

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type TextareaProps = InputProps & {
  rows?: number;
};

type ImageInputProps = {
  label: string;
  value: string;
  altValue?: string;
  altLabel?: string;
  onChange: (value: string) => void;
  onAltChange?: (value: string) => void;
  onUpload?: (file: File) => void;
};

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-base font-extrabold text-gray-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs leading-6 text-gray-500">{description}</p>
        ) : null}
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function Field({ label, children }: FieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold text-gray-700">{label}</span>
      {children}
    </label>
  );
}

export function TextInput({ value, onChange, placeholder }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-900 outline-none transition-all focus:border-[#8B6F47] focus:bg-white"
    />
  );
}

export function TextArea({ value, onChange, placeholder, rows = 3 }: TextareaProps) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs leading-6 text-gray-900 outline-none transition-all focus:border-[#8B6F47] focus:bg-white"
    />
  );
}

export function ActionButton({
  children,
  variant = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "subtle" | "danger";
}) {
  const variantClassName =
    variant === "danger"
      ? "border-[#f1d6d2] text-[#b65349] hover:bg-[#fff3f1]"
      : variant === "subtle"
        ? "border-gray-100 bg-gray-50 text-gray-700 hover:bg-white"
        : "border-[#d8c4a7] bg-[#8b6f47] text-white hover:bg-[#745a37]";

  return (
    <button
      type="button"
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-full border px-4 py-2 text-xs font-bold transition-colors",
        variantClassName,
        props.className ?? "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function ItemShell({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl p-4">{children}</div>;
}

export function ImageInput({
  label,
  value,
  altValue,
  altLabel = "이미지 대체 텍스트",
  onChange,
  onAltChange,
  onUpload,
}: ImageInputProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label={label}>
        <TextInput value={value} onChange={onChange} placeholder="https://..." />
      </Field>
      <div className="space-y-3">
        {onAltChange ? (
          <Field label={altLabel}>
            <TextInput value={altValue ?? ""} onChange={onAltChange} />
          </Field>
        ) : null}
        {onUpload ? (
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (!file) {
                return;
              }

              onUpload(file);
              event.target.value = "";
            }}
            className="block w-full text-[12px] text-gray-500 file:mr-3 file:rounded-full file:border-0 file:bg-[#efe4d3] file:px-4 file:py-2 file:text-[12px] file:font-bold file:text-[#7a6246]"
          />
        ) : null}
      </div>
    </div>
  );
}
