import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Define your private routes here
const protectedRoutes = [
  "/dashboard",
  "/my-profile",
  "/my-property",
  "/my-favorites",
  "/message",
  // Add more private routes as needed
];

const publicAuthRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent authenticated users from accessing public auth routes
  if (publicAuthRoutes.some((route) => pathname.startsWith(route))) {
    const token = request.cookies.get("token")?.value;

    if (token) {
      // Redirect to dashboard if authenticated
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}
