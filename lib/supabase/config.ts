function decodeJwtPayload(token: string) {
  const parts = token.split(".");

  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");

    return JSON.parse(Buffer.from(payload, "base64").toString("utf8")) as {
      ref?: string;
    };
  } catch {
    return null;
  }
}

function normalizeSupabaseUrl(rawValue: string | undefined) {
  if (!rawValue) {
    return null;
  }

  const trimmedValue = rawValue.trim();

  if (!trimmedValue) {
    return null;
  }

  if (trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://")) {
    return trimmedValue;
  }

  if (/^[a-z0-9-]+$/i.test(trimmedValue)) {
    return `https://${trimmedValue}.supabase.co`;
  }

  return null;
}

export function getSupabaseUrl() {
  const directUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);

  if (directUrl) {
    return directUrl;
  }

  const anonPayload = decodeJwtPayload(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "");

  if (anonPayload?.ref) {
    return `https://${anonPayload.ref}.supabase.co`;
  }

  return null;
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
}

export function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
}
