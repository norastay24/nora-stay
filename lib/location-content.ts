import {
  createDefaultGarosugilContent,
  type GarosugilContent,
  type GarosugilFloorGuideCard,
  type GarosugilGalleryCategory,
  type GarosugilGallerySectionContent,
  type GarosugilGallerySlide,
  type GarosugilHeroContent,
  type GarosugilMoment,
  type GarosugilMomentsSectionContent,
  type GarosugilPhilosophySectionContent,
  type GarosugilRoomCategoriesSectionContent,
  type GarosugilRoomCategory,
  type GarosugilSpecItem,
} from "@/lib/garosugil-content";

export type LocationHeroContent = GarosugilHeroContent;
export type LocationSpecItem = GarosugilSpecItem;
export type LocationGallerySlide = GarosugilGallerySlide;
export type LocationGalleryCategory = GarosugilGalleryCategory;
export type LocationGallerySectionContent = GarosugilGallerySectionContent;
export type LocationFloorGuideCard = GarosugilFloorGuideCard;
export type LocationRoomCategory = GarosugilRoomCategory;
export type LocationRoomCategoriesSectionContent = GarosugilRoomCategoriesSectionContent;
export type LocationMoment = GarosugilMoment;
export type LocationMomentsSectionContent = GarosugilMomentsSectionContent;
export type LocationPhilosophySectionContent = GarosugilPhilosophySectionContent;
export type LocationContent = GarosugilContent;

export function createDefaultLocationContent() {
  return createDefaultGarosugilContent();
}
