import { NextRequest, NextResponse } from 'next/server';
import {getCookie, hasCookie} from 'cookies-next';
import {AUTH_SECRET} from "@/server.config";
import * as jwt from 'jsonwebtoken';


export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const isAuthenticated = hasCookie('token', {req, res});

  if (req.nextUrl.pathname === "/login") {
    // Send through to site if authenticated
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } else {
    // Redirect to login page if not authenticated
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', req.url));
    }


    if (req.nextUrl.pathname === "/admin") {
      // Redirect to login if user is not admin
      const token = getCookie('token', {req, res});

      // JWT verify doesn't work in edge runtime
      const decoded = jwt.decode(`${token}`) as jwt.JwtPayload;
      if (decoded.group !== "admin") {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/rooms/:path*',
    '/dashboard/:path*',
    '/desks/:path*',
    '/login/:path*',
    '/admin/:path*',
  ],
}