import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isReportsRoute = request.nextUrl.pathname.startsWith('/reports');
  const isLoginRoute = request.nextUrl.pathname === '/login';
  const sessionCookie = request.cookies.get('session');

  if (isReportsRoute && !sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.href);
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && sessionCookie) {
    const redirectUrl = request.nextUrl.searchParams.get('redirect');
    if (redirectUrl) {
      return NextResponse.redirect(redirectUrl)
    }
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/reports'],
};
