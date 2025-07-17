import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const PUBLIC_PATHS = [
    "/",
  "/login",
  "/register",
  "/api/user/login",
  "/api/user/register",
  "/favicon.ico",
  "/_next",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip public paths
  if (
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/_next") // Next.js assets
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    // Redirect to login if no token
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    jwt.verify(token, JWT_SECRET);
    // Token valid, proceed
    return NextResponse.next();
  } catch (error) {
    // Invalid or expired token, redirect to login
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [ "/clubs/:path*", "/events/:path*"],
};
