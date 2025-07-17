import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/favicon.ico",
  "/_next",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
console.log("Token from cookies:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    console.log('jwt secret', JWT_SECRET);
    
    if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard/clubs/:path*", "/events/:path*"],
};
