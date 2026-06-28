const IMAGE_BUCKET_NAME = "garosugil-location-assets";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

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

    return JSON.parse(window.atob(normalized)) as { ref?: string };
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

export async function uploadGarosugilImage(file: File, folder: string) {
  const supabaseUrl = resolveSupabaseUrl();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!supabaseUrl || !anonKey) {
    throw new Error("SUPABASE_CONFIG_MISSING");
  }

  if (!/^image\/(jpeg|png|webp|gif)$/i.test(file.type)) {
    throw new Error("INVALID_IMAGE_TYPE");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("IMAGE_TOO_LARGE");
  }

  const fileExtension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "";
  const safeExtension =
    fileExtension && /^[a-z0-9]+$/i.test(fileExtension) ? fileExtension : "jpg";
  const objectPath = `${folder}/${crypto.randomUUID()}.${safeExtension}`;

  const response = await fetch(`${supabaseUrl}/storage/v1/object/${IMAGE_BUCKET_NAME}/${objectPath}`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("STORAGE_UPLOAD_FAILED");
  }

  return `${supabaseUrl}/storage/v1/object/public/${IMAGE_BUCKET_NAME}/${objectPath}`;
}
