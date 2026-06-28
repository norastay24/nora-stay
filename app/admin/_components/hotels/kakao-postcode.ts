declare global {
  interface Window {
    kakao?: {
      Postcode: new (options: {
        oncomplete: (data: {
          address: string;
          roadAddress: string;
          jibunAddress: string;
          zonecode: string;
          userSelectedType: "R" | "J";
          bname: string;
          buildingName: string;
          apartment: "Y" | "N";
        }) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

const KAKAO_POSTCODE_SCRIPT_URL =
  "https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

let kakaoPostcodeScriptPromise: Promise<void> | null = null;

export function loadKakaoPostcodeScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is not available."));
  }

  if (window.kakao?.Postcode) {
    return Promise.resolve();
  }

  if (kakaoPostcodeScriptPromise) {
    return kakaoPostcodeScriptPromise;
  }

  kakaoPostcodeScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${KAKAO_POSTCODE_SCRIPT_URL}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load script.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = KAKAO_POSTCODE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load script."));
    document.head.appendChild(script);
  });

  return kakaoPostcodeScriptPromise;
}
