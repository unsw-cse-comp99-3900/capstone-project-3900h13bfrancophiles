import { NextRequest, NextResponse } from 'next/server';
import { hasCookie } from 'cookies-next';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const isAuthenticated = hasCookie('token', { req, res });

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
  }

  return res;
}

export const config = {
  matcher: [
    '/rooms/:path*',
    '/dashboard/:path*',
    '/desks/:path*',
    '/login/:path*'
  ],
}