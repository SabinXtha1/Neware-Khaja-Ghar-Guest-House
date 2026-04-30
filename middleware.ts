import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const publicPaths = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register", "/api/seed"];
const adminPaths = ["/admin"];
const customerPaths = ["/dashboard", "/menu", "/my-bookings", "/my-bills", "/my-orders", "/book-room"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((p) => pathname === p || pathname.startsWith("/api/auth"))) {
    return NextResponse.next();
  }

  // Allow static files and API seed
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname === "/api/seed") {
    return NextResponse.next();
  }

  // Check session
  const session = request.cookies.get("session")?.value;
  const payload = await decrypt(session);

  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin route protection
  if (adminPaths.some((p) => pathname.startsWith(p))) {
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Customer route protection
  if (customerPaths.some((p) => pathname.startsWith(p))) {
    if (payload.role !== "customer") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
};
