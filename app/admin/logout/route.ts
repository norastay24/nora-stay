import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE_NAME } from "@/lib/auth/admin-session";
import { ADMIN_PUBLIC_LOGIN_PATH } from "@/lib/admin-routes";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL(ADMIN_PUBLIC_LOGIN_PATH, request.url));

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: "",
    maxAge: 0,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
