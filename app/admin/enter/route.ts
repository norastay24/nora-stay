import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-session";
import { ADMIN_PUBLIC_LOGIN_PATH, ADMIN_PUBLIC_PATH } from "@/lib/admin-routes";

export async function GET(request: Request) {
  const session = await getAdminSession();
  const target = session ? ADMIN_PUBLIC_PATH : ADMIN_PUBLIC_LOGIN_PATH;

  return NextResponse.redirect(new URL(target, request.url));
}
