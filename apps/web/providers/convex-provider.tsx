/**
 * Convex Provider with Better Auth Integration
 *
 * Wraps the application with Convex client and authentication.
 * This must be a client component that provides React Query context.
 */

"use client";

import { ConvexProviderWithAuth } from "@convex-dev/better-auth/react";
import { convex } from "@/lib/convex";
import { authClient } from "@/lib/auth-client";
import { ReactNode } from "react";

interface ConvexClientProviderProps {
  children: ReactNode;
}

/**
 * Convex Client Provider
 *
 * Provides Convex React Query client with Better Auth integration.
 * Automatically handles authentication state and JWT tokens.
 */
export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  return (
    <ConvexProviderWithAuth client={convex} authClient={authClient}>
      {children}
    </ConvexProviderWithAuth>
  );
}
