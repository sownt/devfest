import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export async function middleware(request: NextRequest) {
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
    const isLoginRoute = request.nextUrl.pathname === '/login';
    const sessionCookie = request.cookies.get('session');

    if (isAdminRoute && !sessionCookie) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (isLoginRoute && sessionCookie) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
    }

    if (request.nextUrl.pathname === '/admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url)
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/reports', '/admin/:path*'],
};
