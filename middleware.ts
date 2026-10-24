import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const customerToken = request.cookies.get("cravings_customer_token")?.value;
  const adminToken = request.cookies.get("cravings_admin_token")?.value;

  // 1. Admin Routes Protection
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!adminToken) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Customer Protected Routes
  const customerProtectedPaths = [
    "/menu",
    "/cart",
    "/checkout",
    "/orders",
    "/track-order",
  ];

  const isCustomerProtected = customerProtectedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (isCustomerProtected) {
    if (!customerToken) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/menu/:path*",
    "/cart",
    "/checkout",
    "/orders",
    "/track-order",
  ],
};
