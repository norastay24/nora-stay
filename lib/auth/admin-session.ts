import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE_NAME = "nora_admin_session";

const DEFAULT_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

interface AdminSessionPayload {
  sub: string;
  email: string;
  role: "admin";
  exp: number;
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function signPayload(payload: string) {
  return createHmac("sha256", getAdminSessionSecret())
    .update(payload)
    .digest("base64url");
}

export function createAdminSessionToken(
  payload: Omit<AdminSessionPayload, "exp">,
  maxAgeSeconds = DEFAULT_SESSION_MAX_AGE_SECONDS,
) {
  const sessionPayload: AdminSessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };

  const encodedPayload = encodeBase64Url(JSON.stringify(sessionPayload));
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const secret = getAdminSessionSecret();

  if (!secret) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      decodeBase64Url(encodedPayload),
    ) as AdminSessionPayload;

    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    if (payload.role !== "admin") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  return verifyAdminSessionToken(token);
}
