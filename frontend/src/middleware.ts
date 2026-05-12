import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Protected routes: /dashboard or /models without token → redirect to /login
  const isProtectedRoute =
    pathname.startsWith('/dashboard') || pathname.startsWith('/models');

  // Auth routes: /login or /register with token → redirect to /dashboard
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/models/:path*', '/login', '/register'],
};
