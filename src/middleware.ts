import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/verify(.*)",
  "/api/(.*)",
]);

const isPublicApiRoute = createRouteMatcher([
  "/api/auth/username-available",
  "/api/users/(.*)",
  "/api/agent/webhook/sms",
  "/api/cron/reminders",
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicApiRoute(req)) {
    return;
  }

  if (isProtectedRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
