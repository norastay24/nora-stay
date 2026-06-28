import Link from "next/link";

type AdminOverviewCardProps = {
  email: string;
};

export function AdminOverviewCard({ email }: AdminOverviewCardProps) {
  return (
    <section className="rounded-[30px] border border-[#ece5da] bg-white px-8 py-8 shadow-[0_16px_42px_rgba(17,24,39,0.06)]">
      <p className="text-[13px] font-black tracking-[0.22em] text-[#a57f49]">
        ADMIN DASHBOARD
      </p>
      <h1 className="mt-4 text-[36px] font-black tracking-[-0.06em] text-[#1d2738]">
        관리자 페이지
      </h1>
      <p className="mt-3 max-w-[780px] text-[16px] leading-[1.75] tracking-[-0.03em] text-[#7b8797]">
        상단 관리자 메뉴를 기준으로 이후 각 관리 화면을 분리할 수 있도록 구조를 정리했습니다.
        현재는 메인 홈 관리 탭이 활성화된 상태이며, 추후 각 메뉴별 페이지 또는 패널을 바로
        연결할 수 있습니다.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div className="rounded-[26px] bg-[#faf7f2] px-7 py-6">
          <p className="text-[14px] font-bold text-[#8f7b63]">로그인된 관리자</p>
          <p className="mt-3 break-all text-[26px] font-black tracking-[-0.05em] text-[#152033]">
            {email}
          </p>
        </div>

        <div className="rounded-[26px] border border-[#f0ebe3] bg-[#fffdfa] px-7 py-6">
          <p className="text-[14px] font-bold text-[#8f7b63]">빠른 작업</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/admin/hotels"
              className="inline-flex h-[44px] items-center rounded-full bg-[#9c7b4b] px-6 text-[14px] font-bold text-white transition-colors duration-200 hover:bg-[#87683f]"
            >
              호텔 지점 관리 열기
            </Link>
            <button
              type="button"
              className="inline-flex h-[44px] items-center rounded-full border border-[#ddd2c4] bg-white px-6 text-[14px] font-bold text-[#685842] transition-colors duration-200 hover:bg-[#faf6ef]"
            >
              메뉴 추가 예정
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
