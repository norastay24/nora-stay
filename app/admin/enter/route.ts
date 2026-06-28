import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-session";

export async function GET(request: Request) {
  const session = await getAdminSession();
  const target = session ? "/admin" : "/login";

  return NextResponse.redirect(new URL(target, request.url));
}
