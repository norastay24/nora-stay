import Link from "next/link";
import Image from "next/image";

export function AdminHeaderBrand() {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Link href="/" className="flex items-center gap-1.5">
        <Image
          src="/images/nora_logo_black.png"
          alt="Nora Stay"
          width={148}
          height={31}
          priority
          className="h-[18px] w-auto object-contain md:h-5"
        />
        <span className="relative ml-0.5 mt-1 self-center pb-0.5 text-[10px] font-black tracking-widest text-[#8b6f47]">
          STAY
          <span
            className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#8b6f47]"
            aria-hidden="true"
          />
        </span>
      </Link>

      <span className="h-3 w-px bg-gray-200" aria-hidden="true" />

      <span className="whitespace-nowrap rounded-full bg-[#8b6f47]/10 px-2 py-1 text-[10px] font-bold tracking-[0.12em] text-[#8b6f47] md:px-2.5">
        관리자
      </span>
    </div>
  );
}
