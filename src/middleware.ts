import { route } from "@/constants/route";
import { authConfig } from "@/features/auth/config";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [route.profile, route.post.create] as const;
const publicRoutes = [route.auth.login, route.auth.signup] as const;

export const middleware = async (request: NextRequest) => {
  const isLoggedIn = request.cookies.has(authConfig.sessionTokenKey);

  if (protectedRoutes.includes(request.nextUrl.pathname) && !isLoggedIn) {
    const redirectUrl = new URL(route.auth.login, request.url);

    redirectUrl.searchParams.append("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(redirectUrl);
  }

  if (publicRoutes.includes(request.nextUrl.pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL(route.home, request.url));
  }
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
