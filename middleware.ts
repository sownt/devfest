import axios from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getBasePath(request: NextRequest) {
  return request.headers.get("host") ?? request.nextUrl.basePath;
}

export async function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/check-in");
  const isLoginRoute = request.nextUrl.pathname === "/login";
  const sessionCookie = request.cookies.get("session")?.value;

  if (!sessionCookie) {
    if (isAdminRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set(
        "redirect",
        getBasePath(request) + request.nextUrl.pathname
      );
      return NextResponse.redirect(url);
    }
  } else {
    if (isLoginRoute) {
      const url = request.nextUrl.clone();
      const redirectUrl = url.searchParams.get("redirect");
      if (redirectUrl) {
        return NextResponse.redirect(redirectUrl);
      }
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (isAdminRoute) {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/ping`,
        {
          headers: { Cookie: `session=${sessionCookie}` },
          validateStatus: () => true,
        }
      );
      if (res.status !== 200) {
        const url = request.nextUrl.clone();
        url.pathname = "/unauthorized";
        return NextResponse.redirect(url);
      }
    }

    if (request.nextUrl.pathname === "/unauthorized") {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/ping`,
        {
          headers: { Cookie: `session=${sessionCookie}` },
          validateStatus: () => true,
        }
      );
      if (res.status === 200) {
        const url = request.nextUrl.clone();
        url.pathname = "/check-in";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/check-in", "/unauthorized"],
};
