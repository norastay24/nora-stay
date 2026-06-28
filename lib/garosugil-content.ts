import { garosugilFloorGuideCards } from "@/app/locations/garosugil/_components/floor-guide/garosugil-floor-guide.data";
import { garosugilGalleryCategories } from "@/app/locations/garosugil/_components/gallery/garosugil-gallery.data";
import { garosugilHeroData } from "@/app/locations/garosugil/_components/hero/garosugil-hero.data";
import { garosugilMoments } from "@/app/locations/garosugil/_components/moments/garosugil-moments.data";
import { garosugilPhilosophyContent } from "@/app/locations/garosugil/_components/philosophy/garosugil-philosophy.data";
import { garosugilRoomCategories } from "@/app/locations/garosugil/_components/room-categories/garosugil-room-categories.data";
import { garosugilSpecs } from "@/app/locations/garosugil/_components/specs/garosugil-specs.data";

export type GarosugilHeroContent = {
  eyebrow: string;
  eyebrowEn?: string;
  badge: string;
  title: string[];
  titleEn?: string[];
  description: string[];
  descriptionEn?: string[];
  bookingHref: string;
  bookingLabel: string;
  bookingLabelEn?: string;
  mapHref: string;
  mapLabel: string;
  mapLabelEn?: string;
  imageSrc: string;
  imageAlt: string;
};

export type GarosugilSpecItem = {
  id: string;
  label: string;
  labelEn?: string;
  value: string;
  valueEn?: string;
  description: string;
  descriptionEn?: string;
};

export type GarosugilGallerySlide = {
  id: string;
  title: string;
  titleEn?: string;
  imageSrc: string;
  imageAlt: string;
};

export type GarosugilGalleryCategory = {
  id: string;
  label: string;
  labelEn?: string;
  description: string;
  descriptionEn?: string;
  slides: GarosugilGallerySlide[];
};

export type GarosugilGallerySectionContent = {
  eyebrow: string;
  eyebrowEn?: string;
  title: string;
  titleEn?: string;
  categories: GarosugilGalleryCategory[];
};

export type GarosugilFloorGuideCard = {
  id: string;
  eyebrow: string;
  eyebrowEn?: string;
  title: string;
  titleEn?: string;
  description: string[];
  descriptionEn?: string[];
  imageSrc: string;
  imageAlt: string;
  size: "large" | "wide";
};

export type GarosugilFloorGuideSectionContent = {
  eyebrow: string;
  eyebrowEn?: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  cards: GarosugilFloorGuideCard[];
};

export type GarosugilRoomCategory = {
  id: string;
  eyebrow: string;
  eyebrowEn?: string;
  title: string;
  titleEn?: string;
  description: string[];
  descriptionEn?: string[];
  imageSrc: string;
  imageAlt: string;
};

export type GarosugilRoomCategoriesSectionContent = {
  eyebrow: string;
  eyebrowEn?: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  items: GarosugilRoomCategory[];
};

export type GarosugilMoment = {
  id: string;
  icon: string;
  title: string;
  titleEn?: string;
  description: string[];
  descriptionEn?: string[];
};

export type GarosugilMomentsSectionContent = {
  eyebrow: string;
  eyebrowEn?: string;
  title: string;
  titleEn?: string;
  items: GarosugilMoment[];
};

export type GarosugilPhilosophySectionContent = {
  eyebrow: string;
  eyebrowEn?: string;
  title: string[];
  titleEn?: string[];
  description: string[];
  descriptionEn?: string[];
  brandHref: string;
  brandLabel: string;
  brandLabelEn?: string;
  bookingHref: string;
  bookingLabel: string;
  bookingLabelEn?: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: string;
  overlayTextEn?: string;
};

export type GarosugilContent = {
  hero: GarosugilHeroContent;
  specs: GarosugilSpecItem[];
  gallery: GarosugilGallerySectionContent;
  floorGuide: GarosugilFloorGuideSectionContent;
  roomCategories: GarosugilRoomCategoriesSectionContent;
  moments: GarosugilMomentsSectionContent;
  philosophy: GarosugilPhilosophySectionContent;
};

function cloneLines(lines: readonly string[] | string[]) {
  return [...lines];
}

export function createDefaultGarosugilContent(): GarosugilContent {
  return {
    hero: {
      eyebrow: garosugilHeroData.eyebrow,
      eyebrowEn: "A private estate stay in the heart of Gangnam",
      badge: garosugilHeroData.badge,
      title: cloneLines(garosugilHeroData.title),
      titleEn: cloneLines(garosugilHeroData.title),
      description: cloneLines(garosugilHeroData.description),
      descriptionEn: [
        "A private stay where you can fully experience",
        "a grand residence in the center of Gangnam",
      ],
      bookingHref: garosugilHeroData.bookingHref,
      bookingLabel: "Book on Airbnb",
      bookingLabelEn: "Book on Airbnb",
      mapHref: garosugilHeroData.mapHref,
      mapLabel: "Open Map",
      mapLabelEn: "Open Map",
      imageSrc: garosugilHeroData.imageSrc,
      imageAlt: garosugilHeroData.imageAlt,
    },
    specs: garosugilSpecs.map((item, index) => ({
      id: `spec-${index + 1}`,
      label: item.label,
      labelEn: item.label,
      value: item.value,
      valueEn: item.value,
      description: item.description,
      descriptionEn: item.description,
    })),
    gallery: {
      eyebrow: "SPACES PHOTO GALLERY",
      eyebrowEn: "SPACES PHOTO GALLERY",
      title: "Gallery",
      titleEn: "Gallery",
      categories: garosugilGalleryCategories.map((category) => ({
        id: category.id,
        label: category.label,
        labelEn: category.label,
        description: category.slides[0]?.description ?? "",
        descriptionEn: category.slides[0]?.description ?? "",
        slides: category.slides.map((slide, index) => ({
          id: `${category.id}-slide-${index + 1}`,
          title: slide.title,
          titleEn: slide.title,
          imageSrc: slide.imageSrc,
          imageAlt: slide.imageAlt,
        })),
      })),
    },
    floorGuide: {
      eyebrow: "FLOOR GUIDE",
      eyebrowEn: "FLOOR GUIDE",
      title: "Floor Guide",
      titleEn: "Floor Guide",
      description: "Guide to the floors and shared spaces.",
      descriptionEn: "Guide to the floors and shared spaces.",
      cards: garosugilFloorGuideCards.map((card) => ({
        id: card.id,
        eyebrow: card.eyebrow,
        eyebrowEn: card.eyebrow,
        title: card.title,
        titleEn: card.title,
        description: cloneLines(card.description),
        descriptionEn: cloneLines(card.description),
        imageSrc: card.imageSrc,
        imageAlt: card.imageAlt,
        size: card.size,
      })),
    },
    roomCategories: {
      eyebrow: "ROOM CATEGORIES",
      eyebrowEn: "ROOM CATEGORIES",
      title: "Room Categories",
      titleEn: "Room Categories",
      description: "Overview of room types prepared for different stay styles.",
      descriptionEn: "Overview of room types prepared for different stay styles.",
      items: garosugilRoomCategories.map((room) => ({
        id: room.id,
        eyebrow: room.eyebrow,
        eyebrowEn: room.eyebrow,
        title: room.title,
        titleEn: room.title,
        description: cloneLines(room.description),
        descriptionEn: cloneLines(room.description),
        imageSrc: room.imageSrc,
        imageAlt: room.imageAlt,
      })),
    },
    moments: {
      eyebrow: "FOR YOUR MOMENTS",
      eyebrowEn: "FOR YOUR MOMENTS",
      title: "For Your Moments",
      titleEn: "For Your Moments",
      items: garosugilMoments.map((moment) => ({
        id: moment.id,
        icon: moment.icon,
        title: moment.title,
        titleEn: moment.title,
        description: cloneLines(moment.description),
        descriptionEn: cloneLines(moment.description),
      })),
    },
    philosophy: {
      eyebrow: garosugilPhilosophyContent.eyebrow,
      eyebrowEn: "BRAND PHILOSOPHY",
      title: cloneLines(garosugilPhilosophyContent.title),
      titleEn: ["Beyond the edge of daily life,", "the beginning of quiet rest."],
      description: cloneLines(garosugilPhilosophyContent.description),
      descriptionEn: [
        "NORA STAY creates a calm stay",
        "where everyday life and rest meet with intention.",
      ],
      brandHref: garosugilPhilosophyContent.brandHref,
      brandLabel: garosugilPhilosophyContent.brandLabel,
      brandLabelEn: "View Brand Story",
      bookingHref: garosugilPhilosophyContent.bookingHref,
      bookingLabel: garosugilPhilosophyContent.bookingLabel,
      bookingLabelEn: "Book on Airbnb",
      imageSrc: garosugilPhilosophyContent.imageSrc,
      imageAlt: garosugilPhilosophyContent.imageAlt,
      overlayText: garosugilPhilosophyContent.overlayText,
      overlayTextEn: "A private stay that elevates the everyday into a refined pause.",
    },
  };
}
