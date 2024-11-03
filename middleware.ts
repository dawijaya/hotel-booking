import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Tentukan route yang boleh diakses tanpa login
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// Tentukan route yang perlu login untuk diakses
const isProtectedRoute = createRouteMatcher([
  "/hotel-details/:id",
  "/api/uploadthing",
]);

export default clerkMiddleware(async (auth, request) => {
  // Cek apakah route memerlukan login dan pengguna tidak login
  if (!isPublicRoute(request) && isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
