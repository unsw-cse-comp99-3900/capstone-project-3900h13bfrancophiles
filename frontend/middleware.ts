import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next";
import { AUTH_SECRET } from "@/config";
import { jwtVerify } from "jose";

const ENCODED_SECRET = new TextEncoder().encode(AUTH_SECRET);

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const token = getCookie("token", { req, res });

  const isAuthenticated = !!token;

  let group;
  try {
    const { payload } = await jwtVerify(`${token}`, ENCODED_SECRET);
    group = payload.group;
  } catch (e: any) {
    group = undefined;
  }

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
      if (group !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (req.nextUrl.pathname === "/desks") {
      // Redirect to dashboard if user is Other
      if (group === "other") {
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
