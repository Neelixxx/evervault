import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect dashboard + messages API
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/api/messages");

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("ev_session")?.value;
  if (!token) {
    // If API: 401, if page: redirect
    if (pathname.startsWith("/api/")) return new NextResponse("Unauthorized", { status: 401 });
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    await verifySessionToken(token);
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) return new NextResponse("Unauthorized", { status: 401 });
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/releases/:path*", "/api/messages/:path*", "/api/releases/:path*"],
};
