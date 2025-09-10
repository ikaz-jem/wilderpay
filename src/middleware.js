// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";

const authRoutes = ["/login", "/register"];


export async function middleware(req) {
  const ip = req.ip || req.headers.get("x-forwarded-for") || "";
  const requestedWith = await req.headers.get("x-requested-with");
  const allowedOrigins = process.env.ORIGINS?.split(',') || []

  // if (!origin || !allowedOrigins.some(o => origin.includes(o))) {
  //   return Response.json({ success: false, message: 'Forbidden' }, { status: 403 })
  // }

  // if (requestedWith && requestedWith == "org.telegram.messenger"){
  //   blockedIPs.add(ip)
  //   return new NextResponse('Blocked For suspecious activity', { status: 403 });
  // }





  // Check Origin or Referer header to verify request source

  // If origin/referer exists and is not allowed, block the request
  // if (origin && !allowedOrigin.includes(origin)) {
  //   return new NextResponse("Access to yieldium denied from Your device", {
  //     status: 403,
  //   });
  // }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token && token.isBanned) {
    return new NextResponse(
      "Your account has been blocked for suspecious activities",
      { status: 403 }
    );
  }

  const { pathname } = req.nextUrl;
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/login", "/register", `/dashboard/:path*`, "/api/:path*"],
};

// // middleware.ts
// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const authRoutes = ["/login", "/register"];

// const rateLimitMap = new Map();
// const RATE_LIMIT = 10;
// const WINDOW_MS = 60 * 1000;

// export async function middleware(req) {

//   const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
//   const now = Date.now();

// console.log(ip)

//   const entry = rateLimitMap.get(ip) || { count: 0, startTime: now };

//   if (now - entry.startTime > WINDOW_MS) {
//     entry.count = 1;
//     entry.startTime = now;
//   } else {
//     entry.count++;
//   }

//   rateLimitMap.set(ip, entry);

//   if (entry.count > RATE_LIMIT) {
//     return new NextResponse('Too Many Requests', { status: 429 });
//   }

//   const token = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   const { pathname } = req.nextUrl;

//   if (token && authRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL('/dashboard', req.url));
//   }

//   if (!token && pathname.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/login',
//     '/register',
//     '/dashboard/:path*',
//     '/api/:path*',
//   ],
// };
