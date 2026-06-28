import { createClientId } from "@/app/admin/_components/hotels/admin-hotels-shared";
import type { InstagramSlideImage } from "@/app/admin/_components/instagram/admin-instagram-shared";

const IMAGE_BUCKET_NAME = "instagram-slide-images";
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

function decodeJwtPayload(token: string) {
  const parts = token.split(".");

  if (parts.length < 2) {
    return null;
  }

  try {
    const normalized = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");

    return JSON.parse(window.atob(normalized)) as {
      ref?: string;
    };
  } catch {
    return null;
  }
}

function resolveSupabaseUrl() {
  const directUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (directUrl) {
    return directUrl.startsWith("http://") || directUrl.startsWith("https://")
      ? directUrl
      : `https://${directUrl}.supabase.co`;
  }

  const anonPayload = decodeJwtPayload(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "");

  if (anonPayload?.ref) {
    return `https://${anonPayload.ref}.supabase.co`;
  }

  return null;
}

export async function uploadInstagramImages(
  files: File[],
  startIndex: number,
): Promise<{
  uploadedImages: InstagramSlideImage[];
  failedCount: number;
  failureCodes: string[];
}> {
  const supabaseUrl = resolveSupabaseUrl();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!supabaseUrl || !anonKey) {
    throw new Error("SUPABASE_CONFIG_MISSING");
  }

  const results = await Promise.allSettled(
    files.map(async (file, index) => {
      if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
        throw new Error("INVALID_IMAGE_TYPE");
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        throw new Error("IMAGE_TOO_LARGE");
      }

      const fileExtension = file.name.includes(".")
        ? file.name.split(".").pop()?.toLowerCase()
        : "";
      const safeExtension =
        fileExtension && /^[a-z0-9]+$/i.test(fileExtension) ? fileExtension : "jpg";
      const objectPath = `slides/${createClientId()}.${safeExtension}`;
      const response = await fetch(
        `${supabaseUrl}/storage/v1/object/${IMAGE_BUCKET_NAME}/${objectPath}`,
        {
          method: "POST",
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            "Content-Type": file.type || "application/octet-stream",
            "x-upsert": "true",
          },
          body: file,
        },
      );

      if (!response.ok) {
        throw new Error("STORAGE_UPLOAD_FAILED");
      }

      return {
        id: createClientId(),
        url: `${supabaseUrl}/storage/v1/object/public/${IMAGE_BUCKET_NAME}/${objectPath}`,
        label: `Slide #${startIndex + index + 1}`,
      };
    }),
  );

  const uploadedImages = results
    .filter(
      (
        result,
      ): result is PromiseFulfilledResult<InstagramSlideImage> => result.status === "fulfilled",
    )
    .map((result) => result.value);

  const failureCodes = results
    .filter((result): result is PromiseRejectedResult => result.status === "rejected")
    .map((result) =>
      result.reason instanceof Error ? result.reason.message : "STORAGE_UPLOAD_FAILED",
    );

  if (uploadedImages.length === 0) {
    throw new Error("STORAGE_UPLOAD_FAILED");
  }

  return {
    uploadedImages,
    failedCount: failureCodes.length,
    failureCodes,
  };
}
