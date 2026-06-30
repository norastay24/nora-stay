import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ADMIN_INTERNAL_BASE_PATH,
  ADMIN_INTERNAL_ENTRY_PATH,
  ADMIN_INTERNAL_LOGIN_PATH,
  ADMIN_PUBLIC_PATH,
  isAdminPublicEntryPath,
  isAdminPublicLoginPath,
  isAdminPublicPath,
} from "@/lib/admin-routes";

function rewriteAdminPath(pathname: string) {
  if (pathname === ADMIN_PUBLIC_PATH) {
    return ADMIN_INTERNAL_BASE_PATH;
  }

  return `${ADMIN_INTERNAL_BASE_PATH}${pathname.slice(ADMIN_PUBLIC_PATH.length)}`;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminPublicLoginPath(pathname)) {
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = ADMIN_INTERNAL_LOGIN_PATH;
    return NextResponse.rewrite(nextUrl);
  }

  if (isAdminPublicEntryPath(pathname)) {
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = ADMIN_INTERNAL_ENTRY_PATH;
    return NextResponse.rewrite(nextUrl);
  }

  if (isAdminPublicPath(pathname)) {
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = rewriteAdminPath(pathname);
    return NextResponse.rewrite(nextUrl);
  }

  if (
    pathname === ADMIN_INTERNAL_LOGIN_PATH ||
    pathname === ADMIN_INTERNAL_ENTRY_PATH ||
    pathname === ADMIN_INTERNAL_BASE_PATH ||
    pathname.startsWith(`${ADMIN_INTERNAL_BASE_PATH}/`)
  ) {
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = "/";
    return NextResponse.redirect(nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/admin",
    "/admin/:path*",
    "/nora-login-k4m7p2",
    "/nora-enter-v6q3r8",
    "/nora-admin-a8f2x91",
    "/nora-admin-a8f2x91/:path*",
  ],
};
