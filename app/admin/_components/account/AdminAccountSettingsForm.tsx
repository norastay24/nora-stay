"use client";

import { useState } from "react";
import { KeyRound, Save, UserRound } from "lucide-react";

type AdminAccountSettingsFormProps = {
  email: string;
};

type FormState = {
  currentPassword: string;
  nextPassword: string;
  confirmPassword: string;
};

const INITIAL_FORM_STATE: FormState = {
  currentPassword: "",
  nextPassword: "",
  confirmPassword: "",
};

export function AdminAccountSettingsForm({ email }: AdminAccountSettingsFormProps) {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!form.currentPassword || !form.nextPassword || !form.confirmPassword) {
      setErrorMessage("모든 항목을 입력해주세요.");
      return;
    }

    if (form.nextPassword.length < 8) {
      setErrorMessage("새 비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (form.currentPassword === form.nextPassword) {
      setErrorMessage("새 비밀번호는 현재 비밀번호와 다르게 입력해주세요.");
      return;
    }

    if (form.nextPassword !== form.confirmPassword) {
      setErrorMessage("새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          nextPassword: form.nextPassword,
          confirmPassword: form.confirmPassword,
        }),
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok) {
        setErrorMessage(result.error ?? "비밀번호 변경 중 오류가 발생했습니다.");
        return;
      }

      setSuccessMessage("비밀번호가 변경되었습니다.");
      setForm(INITIAL_FORM_STATE);
    } catch {
      setErrorMessage("비밀번호 변경 요청 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // 가이드에 맞춘 입력 필드 클래스
  const inputClassName =
    "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#8B6F47] transition-all";

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 max-w-xl mx-auto space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="text-[#8B6F47]">
            <UserRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">관리자 계정 설정</h3>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              어드민 대시보드 로그인 비밀번호를 변경하고 계정 보안을 설정합니다.
            </p>
          </div>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">관리자 이메일 (변경 불가)</label>
          <input
            disabled
            className={`${inputClassName} cursor-not-allowed text-gray-400 font-bold`}
            type="text"
            value={email}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">현재 비밀번호</label>
          <input
            type="password"
            placeholder="••••••"
            className={inputClassName}
            value={form.currentPassword}
            onChange={(e) => updateField("currentPassword", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">새 비밀번호</label>
          <input
            type="password"
            placeholder="새 비밀번호 입력"
            className={inputClassName}
            value={form.nextPassword}
            onChange={(e) => updateField("nextPassword", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">새 비밀번호 확인</label>
          <input
            type="password"
            placeholder="새 비밀번호 다시 입력"
            className={inputClassName}
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
          />
        </div>

        {errorMessage && (
          <p className="text-[10px] font-bold text-red-500 bg-red-50 px-3 py-2 rounded-lg">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[#8B6F47] hover:bg-[#725a38] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            <KeyRound className="w-4 h-4 animate-pulse" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSubmitting ? "변경 중..." : "비밀번호 변경 및 저장"}</span>
        </button>
      </form>
    </section>
  );
}