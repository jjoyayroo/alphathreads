import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const { pathname } = request.nextUrl;

  // Allow access to signin page
  if (pathname === '/signin') {
    if (authCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protect root and all routes under (protected)
  if (!authCookie && (pathname === '/' || pathname.startsWith('/(protected)'))) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/signin', '/(protected)/:path*']
}; 