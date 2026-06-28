import { getSupabaseAnonKey, getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";

interface SupabasePasswordLoginResult {
  user: {
    id: string;
    email?: string;
  };
}

interface AdminProfile {
  id: string;
  email: string;
  role: string;
}

interface UpdateAdminPasswordResponse {
  id: string;
}

export async function signInAdminWithPassword(email: string, password: string) {
  const supabaseUrl = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase 환경 변수가 올바르지 않습니다.");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as SupabasePasswordLoginResult;
}

export async function getAdminProfileByUserId(userId: string) {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase 관리자 환경 변수가 올바르지 않습니다.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=id,email,role&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  const profiles = (await response.json()) as AdminProfile[];

  return profiles[0] ?? null;
}

export async function updateAdminPasswordByUserId(userId: string, password: string) {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase 관리자 환경 변수가 올바르지 않습니다.");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: "PUT",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "비밀번호 변경에 실패했습니다.");
  }

  return (await response.json()) as UpdateAdminPasswordResponse;
}
