import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { createAuth } from "./auth";

/**
 * HTTP Router for Convex
 *
 * Handles HTTP endpoints for:
 * - Better Auth authentication routes (/auth/*)
 * - Future API endpoints (if needed)
 */

const http = httpRouter();

/**
 * Better Auth Routes
 *
 * Handles all authentication requests:
 * - POST /auth/sign-up - User registration
 * - POST /auth/sign-in - User login
 * - POST /auth/sign-out - User logout
 * - GET /auth/session - Get current session
 * - And more...
 */
http.route({
  path: "/auth/*",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

http.route({
  path: "/auth/*",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

export default http;
