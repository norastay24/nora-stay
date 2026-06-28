import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminSessionToken, ADMIN_SESSION_COOKIE_NAME } from "@/lib/auth/admin-session";
import { getAdminProfileByUserId, signInAdminWithPassword } from "@/lib/supabase/admin-auth";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 },
      );
    }

    const authResult = await signInAdminWithPassword(email, password);

    if (!authResult?.user?.id) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 },
      );
    }

    const profile = await getAdminProfileByUserId(authResult.user.id);

    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 없는 계정입니다." },
        { status: 403 },
      );
    }

    const sessionToken = createAdminSessionToken({
      sub: profile.id,
      email: profile.email,
      role: "admin",
    });

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
