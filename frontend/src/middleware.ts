import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Since we use localStorage in Zustand (client-side), 
  // we can't easily read it in Middleware (server-side).
  // However, we can use a cookie as a mirror for route protection if needed.
  // For now, we'll implement a basic structure that can be expanded.
  
  const { pathname } = request.nextUrl;
  
  // Define protected and public routes
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/models');
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  // Note: For real-world use with Zustand, you'd typically set a cookie 
  // during login and check it here. 
  // Example logic (requires a cookie named 'auth-token'):
  /*
  const token = request.cookies.get('auth-token');
  
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  */

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/models/:path*'],
};
