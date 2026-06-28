import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-session";
import {
  getAdminProfileByUserId,
  signInAdminWithPassword,
  updateAdminPasswordByUserId,
} from "@/lib/supabase/admin-auth";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, nextPassword, confirmPassword } = (await request.json()) as {
      currentPassword?: string;
      nextPassword?: string;
      confirmPassword?: string;
    };

    if (!currentPassword || !nextPassword || !confirmPassword) {
      return NextResponse.json({ error: "모든 항목을 입력해주세요." }, { status: 400 });
    }

    if (nextPassword.length < 8) {
      return NextResponse.json(
        { error: "새 비밀번호는 8자 이상이어야 합니다." },
        { status: 400 },
      );
    }

    if (currentPassword === nextPassword) {
      return NextResponse.json(
        { error: "새 비밀번호는 현재 비밀번호와 다르게 입력해주세요." },
        { status: 400 },
      );
    }

    if (nextPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "새 비밀번호 확인이 일치하지 않습니다." },
        { status: 400 },
      );
    }

    const profile = await getAdminProfileByUserId(session.sub);

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "관리자 계정을 확인할 수 없습니다." }, { status: 403 });
    }

    const authResult = await signInAdminWithPassword(profile.email, currentPassword);

    if (!authResult?.user?.id || authResult.user.id !== session.sub) {
      return NextResponse.json(
        { error: "현재 비밀번호가 올바르지 않습니다." },
        { status: 401 },
      );
    }

    await updateAdminPasswordByUserId(session.sub, nextPassword);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "비밀번호 변경 중 오류가 발생했습니다.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
