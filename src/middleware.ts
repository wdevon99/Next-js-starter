import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_API_ROUTES = ["/api/todo"];
const PROTECTED_ROUTES = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const isProtectedApiRoute = PROTECTED_API_ROUTES.some((route: string) => request.nextUrl?.pathname?.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route: string) => request.nextUrl?.pathname?.startsWith(route));

  if (isProtectedApiRoute) {
    const isAuth = await isAuthenticated(request);
    if (!isAuth) {
      return Response.json({ success: false, message: "Authentication failed" }, { status: 401 });
    }
  }

  if (isProtectedRoute) {
    const isAuth = await isAuthenticated(request);
    if (!isAuth) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

const isAuthenticated = async (request: NextRequest) => {
  const token: any = await getToken({ req: request });
  return !!token && Date.now() <= token.exp * 1000;
};
