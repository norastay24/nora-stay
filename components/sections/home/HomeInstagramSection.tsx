"use client";

import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import type { InstagramSlideImage } from "@/app/admin/_components/instagram/admin-instagram-shared";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

const CARD_STEP = 238;

type HomeInstagramSectionProps = {
  campaignId: string;
  buddyLinkEn: string;
  footerEn: string;
  images: InstagramSlideImage[];
};

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-9 w-9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function HomeInstagramSection({
  campaignId,
  buddyLinkEn,
  footerEn,
  images,
}: HomeInstagramSectionProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(120);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    const updateThumbWidth = () => {
      const swiper = swiperRef.current;
      const track = trackRef.current;
      if (!swiper || !track) return;

      const totalWidth = swiper.wrapperEl?.scrollWidth || swiper.width || 1;
      const visibleRatio = swiper.width / totalWidth;
      setTrackWidth(track.clientWidth);
      setThumbWidth(Math.max(120, track.clientWidth * visibleRatio));
    };

    updateThumbWidth();
    window.addEventListener("resize", updateThumbWidth);
    return () => window.removeEventListener("resize", updateThumbWidth);
  }, []);

  const syncProgress = (swiper: SwiperType) => {
    setProgress(swiper.progress || 0);
  };

  const moveByStep = (direction: "prev" | "next") => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const totalWidth = swiper.wrapperEl?.scrollWidth || swiper.width || 1;
    const maxScrollable = Math.max(totalWidth - swiper.width, 1);
    const progressStep = CARD_STEP / maxScrollable;
    const nextProgress =
      direction === "next"
        ? Math.min(1, (swiper.progress || 0) + progressStep)
        : Math.max(0, (swiper.progress || 0) - progressStep);

    swiper.setProgress(nextProgress, 450);
    swiper.updateProgress();
    setProgress(nextProgress);
  };

  const setProgressFromClientX = (clientX: number) => {
    const swiper = swiperRef.current;
    const track = trackRef.current;
    if (!swiper || !track) return;

    const rect = track.getBoundingClientRect();
    const available = Math.max(rect.width - thumbWidth, 1);
    const relative = Math.min(Math.max(clientX - rect.left - thumbWidth / 2, 0), available);
    const nextProgress = relative / available;

    swiper.setProgress(nextProgress, 0);
    swiper.updateProgress();
    setProgress(nextProgress);
  };

  const handleTrackPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setProgressFromClientX(event.clientX);
  };

  const handleThumbPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const move = (moveEvent: PointerEvent) => {
      setProgressFromClientX(moveEvent.clientX);
    };

    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <section className="bg-[#fff] px-4 py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center">
          <p className="text-[14px] font-semibold tracking-[0.14em] text-[#8b6f47]">
            INSTAGRAM
          </p>
          <h2 className={`${poppins.className} mt-4 text-[30px] font-black`}>
            {campaignId}
          </h2>
        </div>

        <div className="group relative mt-14">
          <div className="relative">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => moveByStep("prev")}
              className="absolute left-[-18px] top-1/2 z-10 inline-flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-[#b98f67] bg-white text-[#8f7b67] shadow-[0_8px_18px_rgba(32,28,24,0.12)] opacity-0 transition-all duration-300 hover:bg-[#f3ece6] group-hover:opacity-100"
            >
              <ArrowLeftIcon />
            </button>

            <button
              type="button"
              aria-label="Next"
              onClick={() => moveByStep("next")}
              className="absolute right-[-18px] top-1/2 z-10 inline-flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-[#b98f67] bg-white text-[#8f7b67] shadow-[0_8px_18px_rgba(32,28,24,0.12)] opacity-0 transition-all duration-300 hover:bg-[#f3ece6] group-hover:opacity-100"
            >
              <ArrowRightIcon />
            </button>

            <Swiper
              modules={[FreeMode]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                syncProgress(swiper);

                const totalWidth = swiper.wrapperEl?.scrollWidth || swiper.width || 1;
                const visibleRatio = swiper.width / totalWidth;
                if (trackRef.current) {
                  setTrackWidth(trackRef.current.clientWidth);
                  setThumbWidth(
                    Math.max(120, trackRef.current.clientWidth * visibleRatio),
                  );
                }
              }}
              onSetTranslate={(swiper) => syncProgress(swiper)}
              slidesPerView="auto"
              spaceBetween={18}
              grabCursor
              freeMode={{
                enabled: true,
                sticky: false,
                momentum: true,
                momentumBounce: false,
                momentumRatio: 0.45,
                momentumVelocityRatio: 0.45,
              }}
              className="instagram-swiper"
            >
              {images.map((image, imageIndex) => (
                <SwiperSlide key={image.id} className="!w-[224px]">
                  <Link
                    href={buddyLinkEn}
                    target="_blank"
                    rel="noreferrer"
                    className="group/item relative block h-[224px] w-[224px] overflow-hidden rounded-[14px]"
                  >
                    <Image
                      src={image.url}
                      alt={image.label || `Nora Stay Instagram ${imageIndex + 1}`}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 ease-out group-hover/item:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/item:bg-black/16" />
                    <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 transition-opacity duration-300 group-hover/item:opacity-100">
                      <InstagramIcon />
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div
            ref={trackRef}
            className="relative mt-4 h-[6px] w-full rounded-full"
            onPointerDown={handleTrackPointerDown}
          >
            <button
              type="button"
              aria-label="Instagram progress"
              onPointerDown={handleThumbPointerDown}
              className="absolute top-0 h-[6px] rounded-full bg-[#e8dfd8] transition-colors duration-200 hover:bg-[#cdbcb5]"
              style={{
                width: `${thumbWidth}px`,
                transform: `translateX(${progress * Math.max(0, trackWidth - thumbWidth)}px)`,
              }}
            />
          </div>
        </div>

        <div className="mt-14 text-center">
          <Link
            href={buddyLinkEn}
            target="_blank"
            rel="noreferrer"
            className="text-[12px] font-semibold text-[#8b6f47]"
          >
            {footerEn}
          </Link>
        </div>
      </div>
    </section>
  );
}
