interface NaverMapOptions {
  center: NaverLatLng;
  zoom: number;
  minZoom?: number;
  mapDataControl?: boolean;
  scaleControl?: boolean;
  logoControl?: boolean;
  zoomControl?: boolean;
}

interface NaverMarkerIcon {
  content: string;
  anchor: NaverPoint;
}

interface NaverMarkerOptions {
  position: NaverLatLng;
  map: NaverMap;
  icon: NaverMarkerIcon;
}

interface NaverPoint {
  x: number;
  y: number;
}

interface NaverLatLng {
  lat: number;
  lng: number;
}

interface NaverMap {
  setCenter(latLng: NaverLatLng): void;
  setZoom(zoom: number): void;
}

interface NaverMarker {
  setIcon(icon: NaverMarkerIcon): void;
}

interface NaverMapEvent {
  addListener(target: NaverMarker, eventName: string, listener: () => void): void;
}

interface NaverMapsNamespace {
  Map: new (element: HTMLElement, options: NaverMapOptions) => NaverMap;
  Marker: new (options: NaverMarkerOptions) => NaverMarker;
  LatLng: new (lat: number, lng: number) => NaverLatLng;
  Point: new (x: number, y: number) => NaverPoint;
  Event: NaverMapEvent;
}

declare global {
  interface Window {
    naver?: {
      maps: NaverMapsNamespace;
    };
  }
}

export {};
