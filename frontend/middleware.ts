import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("token") !== undefined;

  // If the user is authenticated, continue as normal
  if (request.nextUrl.pathname === "/login") {
    // Send through to site if authenticated
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // Redirect to login page if not authenticated
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
}