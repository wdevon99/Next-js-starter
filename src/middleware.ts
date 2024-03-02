import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: "/api/:function*",
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // TODO :: Token is availble here but need to handle auth for currect routes

  const isAuthenticated = true; // TODO :: Implement Role based Auth

  if (!isAuthenticated) {
    return Response.json({ success: false, message: "Authentication failed" }, { status: 401 });
  }
}
