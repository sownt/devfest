import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export async function middleware(request: NextRequest) {
    const isAdminRoute = request.nextUrl.pathname.startsWith('/check-in');
    const isLoginRoute = request.nextUrl.pathname === '/login';
    const sessionCookie = request.cookies.get('session');

    if (isAdminRoute && !sessionCookie) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', (request.headers.get("host") ?? request.nextUrl.basePath) + request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    if (isLoginRoute && sessionCookie) {
        const url = request.nextUrl.clone();
        const redirectUrl = url.searchParams.get('redirect');
        if (redirectUrl) {
            return NextResponse.redirect(redirectUrl)
        }
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    if (request.nextUrl.pathname === '/admin') {
        const url = request.nextUrl.clone();
        const redirectUrl = url.searchParams.get('redirect');
        if (redirectUrl) {
            return NextResponse.redirect(redirectUrl)
        }
        return NextResponse.redirect(url)
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/check-in'],
};
