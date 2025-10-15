/**
 * Better Auth Client Configuration
 *
 * Client-side authentication utilities for React components.
 * Uses Better Auth with Convex plugin for seamless integration.
 */

import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

/**
 * Better Auth Client
 *
 * Provides client-side authentication methods:
 * - signIn() - User login
 * - signUp() - User registration
 * - signOut() - User logout
 * - useSession() - React hook for current session
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  plugins: [
    convexClient(),
    // Add organization plugin here if multi-tenant is needed
  ],
});

/**
 * Export commonly used hooks for convenience
 */
export const { useSession, signIn, signUp, signOut } = authClient;
