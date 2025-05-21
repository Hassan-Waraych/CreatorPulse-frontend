import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip middleware for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Skip middleware for login page
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }

  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  
  // For admin routes, we'll let the client-side handle the auth check
  // since we can't access localStorage in middleware
  if (isAdminPath) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/portal/:path*',
  ],
}; 