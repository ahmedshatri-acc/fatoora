import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "fatoora_session";

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get(COOKIE_NAME);
  const isAuthed = Boolean(sessionCookie?.value);
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage = ["/login", "/signup"].includes(request.nextUrl.pathname);

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
