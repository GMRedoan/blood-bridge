import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const roleRoutes: Record<string, string> = {
  "/dashboard/patient": "PATIENT",
  "/dashboard/donor": "DONOR",
  "/dashboard/hospital": "HOSPITAL",
  "/dashboard/admin": "ADMIN",
};

const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

async function getUserRole(token?: string): Promise<string | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return typeof payload.role === "string" ? payload.role.toUpperCase() : null;
  } catch (error) {
    console.log("JWT ERROR", error); 
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const userRole = await getUserRole(accessToken);
  const isProtected = pathname.startsWith("/dashboard");

  if (!userRole && isProtected) {
    const url = new URL("/", request.url);
    url.searchParams.set("login", "1");
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (userRole) {
    for (const [route, requiredRole] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(route) && userRole !== requiredRole) {
        return NextResponse.redirect(
          new URL(`/not-found}`, request.url),
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)",
  ],
};
