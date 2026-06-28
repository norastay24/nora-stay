"use client";

import { useEffect, useState } from "react";
import {
  AdminHotelsAmenitiesSection,
  AdminHotelsCoreFields,
  AdminHotelsFormHeader,
  AdminHotelsImagesSection,
  AdminHotelsLinkFields,
  AdminHotelsMapStatus,
  type AdminHotelsFieldChangeHandler,
} from "@/app/admin/_components/hotels/admin-hotels-form-sections";
import {
  hotelCategoryTags,
  hotelColorThemes,
  type AdminHotelBranch,
} from "@/app/admin/_components/hotels/admin-hotels-shared";
import { loadKakaoPostcodeScript } from "@/app/admin/_components/hotels/kakao-postcode";
import { useAdminHotelGeocode } from "@/app/admin/_components/hotels/use-admin-hotel-geocode";

type AdminHotelsFormProps = {
  branch: AdminHotelBranch;
  imageDraftUrl: string;
  imageUploadPending: boolean;
  amenityDraft: string;
  amenityDraftEn: string;
  onFieldChange: AdminHotelsFieldChangeHandler;
  onToggleTheme: (theme: (typeof hotelColorThemes)[number]) => void;
  onToggleCategory: (tag: (typeof hotelCategoryTags)[number]) => void;
  onFeatureBadgesChange: (value: string) => void;
  onImageDraftChange: (value: string) => void;
  onAddImage: () => void;
  onUploadImage: (files: File[]) => void;
  onUpdateImageCaption: (imageId: string, value: string) => void;
  onMoveImage: (imageId: string, direction: "left" | "right") => void;
  onRemoveImage: (imageId: string) => void;
  onAmenityDraftChange: (value: string) => void;
  onAmenityDraftEnChange: (value: string) => void;
  onAddAmenity: () => void;
  onAddAmenityEn: () => void;
  onUpdateAmenity: (index: number, value: string) => void;
  onUpdateAmenityEn: (index: number, value: string) => void;
  onRemoveAmenity: (index: number) => void;
  onRemoveAmenityEn: (index: number) => void;
};

export function AdminHotelsForm({
  branch,
  imageDraftUrl,
  imageUploadPending,
  amenityDraft,
  amenityDraftEn,
  onFieldChange,
  onToggleTheme,
  onToggleCategory,
  onFeatureBadgesChange,
  onImageDraftChange,
  onAddImage,
  onUploadImage,
  onUpdateImageCaption,
  onMoveImage,
  onRemoveImage,
  onAmenityDraftChange,
  onAmenityDraftEnChange,
  onAddAmenity,
  onAddAmenityEn,
  onUpdateAmenity,
  onUpdateAmenityEn,
  onRemoveAmenity,
  onRemoveAmenityEn,
}: AdminHotelsFormProps) {
  const [addressSearchPending, setAddressSearchPending] = useState(false);
  const geocodeState = useAdminHotelGeocode(branch.address);

  useEffect(() => {
    if (!branch.address.trim()) {
      if (branch.latitude !== undefined) {
        onFieldChange("latitude", undefined);
      }

      if (branch.longitude !== undefined) {
        onFieldChange("longitude", undefined);
      }

      return;
    }

    if (geocodeState.loading || geocodeState.error) {
      return;
    }

    if (
      geocodeState.latitude !== null &&
      geocodeState.latitude !== branch.latitude
    ) {
      onFieldChange("latitude", geocodeState.latitude);
    }

    if (
      geocodeState.longitude !== null &&
      geocodeState.longitude !== branch.longitude
    ) {
      onFieldChange("longitude", geocodeState.longitude);
    }
  }, [
    branch.address,
    branch.latitude,
    branch.longitude,
    geocodeState.error,
    geocodeState.latitude,
    geocodeState.loading,
    geocodeState.longitude,
    onFieldChange,
  ]);

  async function handleAddressSearch() {
    try {
      setAddressSearchPending(true);
      await loadKakaoPostcodeScript();

      new window.kakao!.Postcode({
        oncomplete: (data) => {
          const extraAddressParts: string[] = [];

          if (data.userSelectedType === "R") {
            if (data.bname && /[동로가]$/.test(data.bname)) {
              extraAddressParts.push(data.bname);
            }

            if (data.buildingName && data.apartment === "Y") {
              extraAddressParts.push(data.buildingName);
            }
          }

          const baseAddress =
            data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
          const extraAddress = extraAddressParts.length
            ? ` (${extraAddressParts.join(", ")})`
            : "";

          onFieldChange("address", `${baseAddress}${extraAddress}`.trim());
        },
      }).open();
    } finally {
      setAddressSearchPending(false);
    }
  }

  void onFeatureBadgesChange;

  return (
    <section className="rounded-[24px] border border-[#e8e2d9] bg-white shadow-sm">
      <AdminHotelsFormHeader branch={branch} onFieldChange={onFieldChange} />

      <div className="space-y-8 px-8 py-7">
        <AdminHotelsCoreFields
          branch={branch}
          addressSearchPending={addressSearchPending}
          onFieldChange={onFieldChange}
          onAddressSearch={handleAddressSearch}
          onToggleTheme={onToggleTheme}
          onToggleCategory={onToggleCategory}
        />

        <AdminHotelsLinkFields branch={branch} onFieldChange={onFieldChange} />

        <AdminHotelsImagesSection
          branch={branch}
          imageDraftUrl={imageDraftUrl}
          imageUploadPending={imageUploadPending}
          onImageDraftChange={onImageDraftChange}
          onAddImage={onAddImage}
          onUploadImage={onUploadImage}
          onUpdateImageCaption={onUpdateImageCaption}
          onMoveImage={onMoveImage}
          onRemoveImage={onRemoveImage}
        />

        <AdminHotelsAmenitiesSection
          branch={branch}
          amenityDraft={amenityDraft}
          amenityDraftEn={amenityDraftEn}
          onAmenityDraftChange={onAmenityDraftChange}
          onAmenityDraftEnChange={onAmenityDraftEnChange}
          onAddAmenity={onAddAmenity}
          onAddAmenityEn={onAddAmenityEn}
          onUpdateAmenity={onUpdateAmenity}
          onUpdateAmenityEn={onUpdateAmenityEn}
          onRemoveAmenity={onRemoveAmenity}
          onRemoveAmenityEn={onRemoveAmenityEn}
        />

        <AdminHotelsMapStatus
          address={branch.address}
          geocodeState={geocodeState}
          savedLatitude={branch.latitude}
          savedLongitude={branch.longitude}
        />
      </div>
    </section>
  );
}
