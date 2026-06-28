import {
  ChevronDown,
  Link2,
  MapPin,
  Search,
  Trash2,
  Waypoints,
  Clock,
  Check,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Plus
} from "lucide-react";
import {
  hotelCategoryTags,
  hotelColorThemes,
  hotelThemeColorMap,
  koreaRegionOptions,
  type AdminHotelBranch,
} from "@/app/admin/_components/hotels/admin-hotels-shared";
import type { GeocodeState } from "@/app/admin/_components/hotels/use-admin-hotel-geocode";

export type AdminHotelsFieldChangeHandler = <K extends keyof AdminHotelBranch>(
  field: K,
  value: AdminHotelBranch[K],
) => void;

type HeaderProps = {
  branch: AdminHotelBranch;
  onFieldChange: AdminHotelsFieldChangeHandler;
};

type CoreFieldsProps = {
  branch: AdminHotelBranch;
  addressSearchPending: boolean;
  onFieldChange: AdminHotelsFieldChangeHandler;
  onAddressSearch: () => void;
  onToggleTheme: (theme: (typeof hotelColorThemes)[number]) => void;
  onToggleCategory: (tag: (typeof hotelCategoryTags)[number]) => void;
};

type LinkFieldsProps = {
  branch: AdminHotelBranch;
  onFieldChange: AdminHotelsFieldChangeHandler;
};

type ImagesSectionProps = {
  branch: AdminHotelBranch;
  imageDraftUrl: string;
  imageUploadPending: boolean;
  onImageDraftChange: (value: string) => void;
  onAddImage: () => void;
  onUploadImage: (files: File[]) => void;
  onUpdateImageCaption: (imageId: string, value: string) => void;
  onMoveImage: (imageId: string, direction: "left" | "right") => void;
  onRemoveImage: (imageId: string) => void;
};

type AmenitiesSectionProps = {
  branch: AdminHotelBranch;
  amenityDraft: string;
  amenityDraftEn: string;
  onAmenityDraftChange: (value: string) => void;
  onAmenityDraftEnChange: (value: string) => void;
  onAddAmenity: () => void;
  onAddAmenityEn: () => void;
  onUpdateAmenity: (index: number, value: string) => void;
  onUpdateAmenityEn: (index: number, value: string) => void;
  onRemoveAmenity: (index: number) => void;
  onRemoveAmenityEn: (index: number) => void;
};

type MapStatusProps = {
  address: string;
  geocodeState: GeocodeState;
  savedLatitude?: number;
  savedLongitude?: number;
};

type SaveNoticeProps = {
  savePending: boolean;
  saveMessage: string;
};

export function AdminHotelsFormHeader({ branch, onFieldChange }: HeaderProps) {
  return (
    <div className="flex flex-col gap-6 border-b border-[#f1ece4] px-8 py-7 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6F47]">
          지점 상세 정보 편집
        </span>
        <input
          value={branch.name}
          onChange={(event) => onFieldChange("name", event.target.value)}
          data-admin-hotel-field="name"
          className="w-full pb-1 text-[24px] font-extrabold tracking-[-0.03em] text-gray-900 transition-all bg-transparent border-b border-transparent hover:border-gray-200 focus:border-[#8B6F47] focus:outline-none"
          placeholder="지점명 (국문)"
        />
        <input
          value={branch.summary}
          onChange={(event) => onFieldChange("summary", event.target.value)}
          className="w-full pb-1 text-[13px] text-gray-400 transition-all bg-transparent border-b border-transparent hover:border-gray-200 focus:border-[#8B6F47] focus:outline-none"
          placeholder="지점명 (영문)"
        />
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-[#FAF9F5] p-3 shrink-0">
        {/* 노출 여부 */}
        <div className="flex flex-col items-center gap-1 px-2">
          <span className="text-[9px] font-bold text-gray-400">노출 여부</span>
          <button
            onClick={() => onFieldChange("isVisible", !branch.isVisible)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${branch.isVisible ? 'bg-emerald-600' : 'bg-gray-300'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${branch.isVisible ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        {/* 영업 상태 */}
        <div className="flex flex-col items-center gap-1 px-2">
          <span className="text-[9px] font-bold text-gray-400">영업 상태</span>
          <button
            onClick={() => onFieldChange("isFeatured", !branch.isFeatured)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${branch.isFeatured ? 'bg-emerald-600' : 'bg-amber-500'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${branch.isFeatured ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
          <span className="text-[8px] font-bold text-gray-500">
            {branch.isFeatured ? "영업중" : "준비중"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function AdminHotelsCoreFields({
  branch,
  addressSearchPending,
  onFieldChange,
  onAddressSearch,
  onToggleTheme,
  onToggleCategory,
}: CoreFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 지점 주소 */}
      <div className="space-y-1.5 md:col-span-2">
        <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
          <span>지점 주소</span>
          <button
            type="button"
            onClick={onAddressSearch}
            disabled={addressSearchPending}
            className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full flex items-center gap-1 transition-all"
          >
            <Search className="w-3 h-3" />
            {addressSearchPending ? "불러오는 중" : "주소 찾기"}
          </button>
        </label>
        <input
          value={branch.address}
          readOnly
          data-admin-hotel-field="address"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none hover:bg-gray-100/50 transition-all cursor-pointer"
          placeholder="주소 찾기 버튼을 눌러 입력해 주세요."
        />
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <label className="text-xs font-bold text-gray-700">지점 주소 (EN)</label>
        <input
          value={branch.addressEn}
          onChange={(e) => onFieldChange("addressEn", e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#8B6F47] transition-all"
          placeholder="English address"
        />
      </div>

      {/* 체크인/아웃 시간 */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700">체크인 시간</label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={branch.checkInTime}
            onChange={(e) => onFieldChange("checkInTime", e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#8B6F47] transition-all"
            placeholder="예: 15:00"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700">체크아웃 시간</label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={branch.checkOutTime}
            onChange={(e) => onFieldChange("checkOutTime", e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#8B6F47] transition-all"
            placeholder="예: 11:00"
          />
        </div>
      </div>

      {/* 테마 컬러 선택 */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-xs font-bold text-gray-700 block">브랜드 테마 컬러 (지도 핀 및 강조색)</label>
        <div className="flex flex-wrap gap-3">
          {hotelColorThemes.map((theme) => {
            const selected = branch.colorThemes[0] === theme;
            return (
              <button
                key={theme}
                type="button"
                onClick={() => onToggleTheme(theme)}
                className={`px-3 py-2 rounded-xl border text-[10px] font-bold flex items-center gap-2 transition-all ${selected ? "bg-white border-gray-900 shadow-sm" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                  }`}
              >
                <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: hotelThemeColorMap[theme] }} />
                {theme === "Nora Brown" ? `${theme} (기본)` : theme}
                {selected && <Check className="w-3 h-3 text-gray-900" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 카테고리 태그 */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-xs font-bold text-gray-700 block">아이콘 카테고리 태그 (복수 선택 가능)</label>
        <div className="flex flex-wrap gap-2">
          {hotelCategoryTags.map((tag) => {
            const selected = branch.categoryTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleCategory(tag)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${selected ? "bg-white border-gray-900 text-gray-900 shadow-sm font-bold" : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"
                  }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* 소개글 */}
      <div className="space-y-1.5 md:col-span-2">
        <label className="text-xs font-bold text-gray-700">지점 소개글</label>
        <textarea
          value={branch.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#8B6F47] transition-all resize-none leading-relaxed"
          placeholder="지점에 대한 감성적이고 세부적인 소개글을 작성해 주세요."
        />
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <label className="text-xs font-bold text-gray-700">지점 소개글 (EN)</label>
        <textarea
          value={branch.descriptionEn}
          onChange={(e) => onFieldChange("descriptionEn", e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#8B6F47] transition-all resize-none leading-relaxed"
          placeholder="Write the English branch description."
        />
      </div>
    </div>
  );
}

export function AdminHotelsLinkFields({ branch, onFieldChange }: LinkFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 객실 구경하기 링크 */}
      <label className="space-y-1.5">
        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <Waypoints className="h-3.5 w-3.5 text-gray-400" />
          객실 구경하기 링크
        </span>
        <input
          value={branch.previewLink}
          onChange={(e) => onFieldChange("previewLink", e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#8B6F47] transition-all"
          placeholder="예: /garosugil"
        />
      </label>

      {/* Airbnb 예약 링크 */}
      <label className="space-y-1.5">
        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <Link2 className="h-3.5 w-3.5 text-gray-400" />
          Airbnb 예약 링크
        </span>
        <input
          value={branch.bookingUrl}
          onChange={(e) => onFieldChange("bookingUrl", e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#8B6F47] transition-all"
          placeholder="https://www.airbnb.co.kr/rooms/..."
        />
      </label>

      {/* 지점 소속 지역 */}
      <label className="space-y-1.5">
        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <MapPin className="h-3.5 w-3.5 text-gray-400" />
          지점 소속 지역
        </span>
        <div className="relative">
          <select
            value={branch.regionLabel}
            onChange={(e) => onFieldChange("regionLabel", e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#8B6F47] transition-all appearance-none"
          >
            <option value="">지역 선택</option>
            {koreaRegionOptions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
        </div>
      </label>

      {/* 노출 정렬 순서 */}
      <label className="space-y-1.5">
        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <ArrowUp className="h-3.5 w-3.5 text-gray-400" />
          노출 정렬 순서
        </span>
        <input
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          value={branch.sortOrder}
          onChange={(e) => onFieldChange("sortOrder", Number(e.target.value) || 0)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#8B6F47] transition-all"
        />
      </label>
    </div>
  );
}

export function AdminHotelsImagesSection({
  branch,
  imageDraftUrl,
  imageUploadPending,
  onImageDraftChange,
  onAddImage,
  onUploadImage,
  onMoveImage,
  onRemoveImage,
}: ImagesSectionProps) {
  return (
    <div className="space-y-4 border-t border-gray-50 pt-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-gray-400" />
          지점 사진 갤러리 관리 ({branch.images.length}장)
        </label>
      </div>

      {/* 업로드 컨트롤 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex gap-2">
          <input
            value={imageDraftUrl}
            onChange={(e) => onImageDraftChange(e.target.value)}
            placeholder="새 이미지 URL 입력"
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#8B6F47] transition-all"
          />
          <button
            type="button"
            onClick={onAddImage}
            className="bg-[#8B6F47] hover:bg-[#705835] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0"
          >
            추가
          </button>
        </div>
        <div className="relative shrink-0">
          <input
            type="file"
            id="gallery-file-upload"
            className="hidden"
            accept="image/*"
            multiple
            disabled={imageUploadPending}
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              if (files.length > 0) onUploadImage(files);
              e.target.value = "";
            }}
          />
          <label
            htmlFor="gallery-file-upload"
            className="flex items-center justify-center gap-1.5 border border-dashed border-gray-300 hover:border-[#8B6F47] bg-gray-50 hover:bg-white text-gray-600 hover:text-[#8B6F47] px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all h-full text-center"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            {imageUploadPending ? "업로드 중..." : "이미지 파일 업로드"}
          </label>
        </div>
      </div>

      {/* 경고 메시지 */}
      <p className="text-[10px] text-amber-600 font-medium bg-amber-50/50 border border-amber-100/50 rounded-lg px-3 py-1.5">
        ※ JPEG, PNG 포맷만 지원하며, 로컬스토리지 저장 용량 제한으로 인해 <strong>개별 파일 크기는 2MB 미만</strong>으로 업로드해 주세요.
      </p>

      {/* 이미지 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
        {branch.images.map((image, index) => (
          <div key={image.id} className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="relative w-full h-40 bg-gray-50 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={`갤러리 ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                대표 이미지 {index + 1}
              </div>
            </div>
            <div className="p-3 flex items-center justify-between gap-2 bg-gray-50/50">
              <span className="flex-1 truncate text-gray-500 font-mono text-[10px]" title={image.url}>
                {image.url}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  disabled={index === 0}
                  onClick={() => onMoveImage(image.id, "left")}
                  className="p-1.5 text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-100 rounded-lg disabled:opacity-30 disabled:hover:bg-white transition-all"
                  title="앞으로 이동"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={index === branch.images.length - 1}
                  onClick={() => onMoveImage(image.id, "right")}
                  className="p-1.5 text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-100 rounded-lg disabled:opacity-30 disabled:hover:bg-white transition-all"
                  title="뒤로 이동"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onRemoveImage(image.id)}
                  className="p-1.5 text-red-500 hover:text-red-700 bg-white hover:bg-red-50 border border-gray-100 hover:border-red-100 rounded-lg transition-all"
                  title="삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminHotelsAmenitiesSection({
  branch,
  amenityDraft,
  amenityDraftEn,
  onAmenityDraftChange,
  onAmenityDraftEnChange,
  onAddAmenity,
  onAddAmenityEn,
  onUpdateAmenity,
  onUpdateAmenityEn,
  onRemoveAmenity,
  onRemoveAmenityEn,
}: AmenitiesSectionProps) {
  return (
    <div className="space-y-4 border-t border-gray-50 pt-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-700 block">
            이 호텔의 특징 상세 리스트 (KR) ({branch.amenityNotes.length}개)
          </label>

          <div className="space-y-2">
            {branch.amenityNotes.map((note, index) => (
              <div
                key={`${branch.id}-amenity-${index}`}
                className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-xs transition-all"
              >
                <span className="text-gray-400 shrink-0">-</span>
                <input
                  value={note}
                  onChange={(e) => onUpdateAmenity(index, e.target.value)}
                  className="flex-1 bg-transparent text-gray-700 outline-none leading-relaxed"
                />
                <button
                  type="button"
                  onClick={() => onRemoveAmenity(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={amenityDraft}
              onChange={(e) => onAmenityDraftChange(e.target.value)}
              placeholder="새로운 특징 항목 추가"
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#8B6F47] transition-all"
            />
            <button
              type="button"
              onClick={onAddAmenity}
              className="bg-[#8B6F47] hover:bg-[#705835] text-white p-2.5 rounded-xl transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-700 block">
            이 호텔의 특징 상세 리스트 (EN) ({branch.amenityNotesEn.length}개)
          </label>

          <div className="space-y-2">
            {branch.amenityNotesEn.map((note, index) => (
              <div
                key={`${branch.id}-amenity-en-${index}`}
                className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-xs transition-all"
              >
                <span className="text-gray-400 shrink-0">-</span>
                <input
                  value={note}
                  onChange={(e) => onUpdateAmenityEn(index, e.target.value)}
                  className="flex-1 bg-transparent text-gray-700 outline-none leading-relaxed"
                />
                <button
                  type="button"
                  onClick={() => onRemoveAmenityEn(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={amenityDraftEn}
              onChange={(e) => onAmenityDraftEnChange(e.target.value)}
              placeholder="Add English feature item"
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#8B6F47] transition-all"
            />
            <button
              type="button"
              onClick={onAddAmenityEn}
              className="bg-[#8B6F47] hover:bg-[#705835] text-white p-2.5 rounded-xl transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminHotelsMapStatus({
  address,
  geocodeState,
  savedLatitude,
  savedLongitude,
}: MapStatusProps) {
  const latitude = geocodeState.latitude ?? savedLatitude;
  const longitude = geocodeState.longitude ?? savedLongitude;

  return (
    <div className="border-t border-gray-50 pt-6 space-y-3">
      <label className="text-xs font-bold text-gray-700 block">네이버 지도 연동 확인</label>

      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2 text-xs text-gray-500">
        <div className="flex items-center gap-2 text-[#8B6F47] font-bold">
          <MapPin className="w-4 h-4" />
          <span>실시간 매핑 좌표 정보</span>
        </div>

        <p>
          주소: <strong className="text-gray-800">{address || "-"}</strong>
        </p>

        <p>
          위도(Latitude): <strong className="text-gray-800">{latitude?.toFixed(4) ?? "-"}</strong> |
          경도(Longitude): <strong className="text-gray-800">{longitude?.toFixed(4) ?? "-"}</strong>
        </p>

        <p className="text-[10px] text-gray-400">
          ※ 대시보드에서 주소 찾기 완료 시 위경도가 자동으로 산출되며, 해당 좌표에 맞춰 손님용 네이버 지도 화면에 <strong>N 심볼 마크</strong> 핀이 정확하게 찍히게 됩니다.
        </p>
      </div>
    </div>
  );
}

export function AdminHotelsSaveNotice({ savePending, saveMessage }: SaveNoticeProps) {
  if (!saveMessage.trim()) {
    return null;
  }

  return (
    <div
      className={[
        "rounded-xl border px-4 py-3 text-xs font-bold",
        savePending
          ? "border-amber-100 bg-amber-50 text-amber-700"
          : "border-emerald-100 bg-emerald-50 text-emerald-700",
      ].join(" ")}
    >
      {saveMessage}
    </div>
  );
}
