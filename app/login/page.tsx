import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin-session";
import { LoginForm } from "@/app/login/_components/LoginForm";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function LoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-96px)] items-center justify-center">
        <section className="w-full max-w-[420px] overflow-hidden rounded-[28px] border border-[#f0e9df] bg-white shadow-[0_14px_32px_rgba(17,24,39,0.09)]">
          <div className="h-[9px] bg-[#a28351]" />

          <div className="px-7 pb-7 pt-7">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-end gap-1.5 leading-none">
                <Image
                  src="/images/nora_logo_black.png"
                  alt="Nora Stay"
                  width={148}
                  height={31}
                  priority
                  className="h-[24px] w-auto object-contain"
                />
                <span className="relative ml-0.5 mt-1 self-center pb-0.5 text-[10px] font-extrabold tracking-widest text-[#8b6f47] sm:text-xs">
                  STAY
                  <span
                    className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#E1B057]"
                    aria-hidden="true"
                  />
                </span>
              </div>

              <h1 className="mt-4 text-[20px] font-bold tracking-[-0.05em] text-[#152033]">
                관리자 대시보드
              </h1>
              <p className="mt-3 text-[12px] leading-[1.6] tracking-[-0.03em] text-[#99aacb]">
                NORA STAY 지점 관리 및 제어 센터
              </p>
            </div>

            <LoginForm />

            <div className="mt-7 border-t border-[#f1f2f5] pt-6 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold tracking-[-0.03em] text-[#748094] transition-colors duration-200 hover:text-[#546276]"
              >
                <Home className="h-[14px] w-[14px]" strokeWidth={2.1} />
                <span>메인홈으로 돌아가기</span>
              </Link>
            </div>

            <p className="mt-7 text-center text-[11px] tracking-[-0.03em] text-[#c0c7d2]">
              © 2026 NORA STAY. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
