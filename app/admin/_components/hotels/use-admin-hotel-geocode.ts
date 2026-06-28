import { useEffect, useState } from "react";

const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
const NAVER_MAP_SCRIPT_ID = "nora-admin-naver-map-script";

export type GeocodeState = {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string;
};

async function loadNaverGeocoder() {
  if (typeof window === "undefined") {
    throw new Error("Window is not available.");
  }

  if (!NAVER_MAP_CLIENT_ID) {
    throw new Error("네이버 지도 클라이언트 ID가 설정되지 않았습니다.");
  }

  if ((window as any).naver?.maps?.Service) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      NAVER_MAP_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("네이버 지도 스크립트를 불러오지 못했습니다.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = NAVER_MAP_SCRIPT_ID;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}&submodules=geocoder`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("네이버 지도 스크립트를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });
}

export function useAdminHotelGeocode(address: string) {
  const [geocodeState, setGeocodeState] = useState<GeocodeState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: "",
  });

  useEffect(() => {
    if (!address.trim()) {
      setGeocodeState({
        latitude: null,
        longitude: null,
        loading: false,
        error: "",
      });
      return;
    }

    let cancelled = false;

    async function geocodeAddress() {
      try {
        setGeocodeState((current) => ({
          ...current,
          loading: true,
          error: "",
        }));

        await loadNaverGeocoder();

        const service = (window as any).naver?.maps?.Service;

        if (!service?.geocode) {
          throw new Error("지도 좌표 변환 서비스를 사용할 수 없습니다.");
        }

        service.geocode({ query: address }, (status: string, response: any) => {
          if (cancelled) {
            return;
          }

          const naver = (window as any).naver;

          if (status !== naver.maps.Service.Status.OK || !response.v2?.addresses?.length) {
            setGeocodeState({
              latitude: null,
              longitude: null,
              loading: false,
              error: "좌표를 찾지 못했습니다.",
            });
            return;
          }

          const firstAddress = response.v2.addresses[0];

          setGeocodeState({
            latitude: Number(firstAddress.y),
            longitude: Number(firstAddress.x),
            loading: false,
            error: "",
          });
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setGeocodeState({
          latitude: null,
          longitude: null,
          loading: false,
          error: error instanceof Error ? error.message : "좌표 변환에 실패했습니다.",
        });
      }
    }

    void geocodeAddress();

    return () => {
      cancelled = true;
    };
  }, [address]);

  return geocodeState;
}
