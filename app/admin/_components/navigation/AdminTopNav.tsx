"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/app/admin/_components/navigation/admin-nav-config";

export function AdminTopNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="관리자 메뉴"
      className="mx-auto w-full max-w-[1200px] overflow-x-auto rounded-[16px] border border-[#e8e2d9] bg-white px-3 py-1.5 shadow-sm"
    >
      <ul className="flex min-w-max items-center gap-2.5">
        {adminNavItems.map((item) => {
          const isActive = item.activeMatch ? item.activeMatch(pathname) : false;
          const Icon = item.icon;
          const className = [
            "inline-flex h-[34px] items-center gap-2.5 rounded-full px-5 text-[12px] font-bold tracking-[-0.03em] transition-all duration-200",
            isActive
              ? "bg-[#9f7b47] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
              : "text-[#69758a] hover:bg-[#f9fafb] hover:text-[#000]",
          ].join(" ");

          const content = (
            <>
              <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
              <span className="whitespace-nowrap">{item.label}</span>
            </>
          );

          return (
            <li key={item.id}>
              {item.href ? (
                <Link href={item.href} className={className}>
                  {content}
                </Link>
              ) : (
                <button type="button" className={className}>
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
