import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "wathq_session";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(COOKIE_NAME);
  // The cookie value is an encrypted iron-session token; presence is enough here.
  // Real session validity is verified in requireSession() inside each route/page.
  const isAuthed = Boolean(sessionCookie?.value);
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (!isAuthed && isDashboard) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isAuthed && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
