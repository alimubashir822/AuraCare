import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Patient Dashboard
  const isPatientRoute = pathname.startsWith("/patient");
  // Protect Doctor Dashboard
  const isDoctorRoute = pathname.startsWith("/doctor");
  // Protect Clinic Dashboard
  const isClinicRoute = pathname.startsWith("/clinic");

  if (isPatientRoute || isDoctorRoute || isClinicRoute) {
    const sessionCookie = request.cookies.get("user-session")?.value;

    if (!sessionCookie) {
      // Not logged in -> redirect to login page
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Decode base64 session cookie
      const decodedSession = JSON.parse(
        Buffer.from(sessionCookie, "base64").toString("utf-8")
      );

      const userRole = decodedSession.role;

      // Check role permissions
      if (isPatientRoute && userRole !== "PATIENT") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      if (isDoctorRoute && userRole !== "DOCTOR") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      if (isClinicRoute && userRole !== "CLINIC_ADMIN") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (e) {
      // Session parsing failed -> clear cookie and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("user-session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/patient/:path*",
    "/doctor/:path*",
    "/clinic/:path*",
  ],
};
