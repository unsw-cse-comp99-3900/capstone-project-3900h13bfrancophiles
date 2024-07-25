import { NextRequest, NextResponse } from "next/server";
import { getCookie, hasCookie } from "cookies-next";
import { AUTH_SECRET } from "@/config";
import { jwtVerify } from "jose";

const ENCODED_SECRET = new TextEncoder().encode(AUTH_SECRET);

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const isAuthenticated = hasCookie("token", { req, res });

  if (req.nextUrl.pathname === "/login") {
    // Send through to site if authenticated
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } else {
    // Redirect to login page if not authenticated
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (req.nextUrl.pathname === "/admin") {
      // Redirect to dashboard if user is not admin
      const token = getCookie("token", { req, res });

      let isAdmin;
      try {
        const { payload } = await jwtVerify(`${token}`, ENCODED_SECRET);
        isAdmin = payload.group === "admin";
      } catch (e: any) {
        isAdmin = false;
      }

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (req.nextUrl.pathname === "/desks") {
      // Redirect to dashboard if user is Other
      const token = getCookie("token", { req, res });

      let canBookDesks;
      try {
        const { payload } = await jwtVerify(`${token}`, ENCODED_SECRET);
        canBookDesks = payload.group !== "other";
      } catch (e: any) {
        canBookDesks = false;
      }

      if (!canBookDesks) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/rooms/:path*",
    "/dashboard/:path*",
    "/desks/:path*",
    "/login/:path*",
    "/admin/:path*",
  ],
};
