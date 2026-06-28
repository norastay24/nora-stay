import { getRequestLocale } from "@/lib/i18n-server";

export default async function NewBranchLocationPage() {
  const locale = await getRequestLocale();

  return (
    <main className="flex-1 bg-[#fcfaf6]">
      <section className="mx-auto flex min-h-[calc(100vh-92px)] w-full max-w-[1200px] items-center px-6 py-24">
        <div className="max-w-[680px]">
          <p className="mb-4 text-sm font-semibold tracking-[0.28em] text-[#d7a44d]">
            LOCATION GUIDE
          </p>
          <h1 className="text-5xl font-semibold tracking-[-0.04em] text-[#1f2937]">
            {locale === "en" ? "New Branch (No. 3)" : "새로운 지점 (3호점)"}
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#6b7280]">
            {locale === "en"
              ? "This placeholder page is used to verify that the location navigation state stays highlighted after moving to a new branch page."
              : "링크 이동 후 지점안내 탭이 노란색으로 유지되는지 확인할 수 있는 기본 페이지입니다."}
          </p>
        </div>
      </section>
    </main>
  );
}
