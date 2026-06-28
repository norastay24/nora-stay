"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok) {
        setErrorMessage(result.error ?? "로그인에 실패했습니다.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setErrorMessage("로그인 요청 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="text-[12px] font-bold tracking-[-0.03em] text-[#324055]"
        >
          이메일 주소
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          className="mt-2 h-[38px] w-full rounded-[12px] border border-[#f0f2f5] bg-[#f7f8fb] px-3.5 text-[13px] tracking-[-0.03em] text-[#445065] outline-none"
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="password"
          className="text-[12px] font-bold tracking-[-0.03em] text-[#324055]"
        >
          비밀번호
        </label>
        <div className="relative mt-2">
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            placeholder="비밀번호 입력"
            className="h-[38px] w-full rounded-[12px] border border-[#f0f2f5] bg-[#f7f8fb] px-3.5 pr-10 text-[13px] tracking-[-0.03em] text-[#445065] outline-none placeholder:text-[#b4bcc8]"
          />
          <LockKeyhole
            className="pointer-events-none absolute right-3.5 top-1/2 h-[13px] w-[13px] -translate-y-1/2 text-[#d0d6de]"
            strokeWidth={1.9}
          />
        </div>
      </div>

      {errorMessage ? (
        <p className="mt-3 text-[11px] font-semibold tracking-[-0.03em] text-[#c14848]">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex h-[40px] w-full items-center justify-center rounded-[12px] bg-[#9c7b4b] text-[13px] font-bold tracking-[-0.04em] text-white shadow-[0_8px_16px_rgba(156,123,75,0.15)] transition-colors duration-200 hover:bg-[#886a40] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "로그인 중..." : "로그인하기"}
      </button>
    </form>
  );
}
