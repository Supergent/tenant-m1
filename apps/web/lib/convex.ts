/**
 * Convex Client Configuration
 *
 * Creates the Convex client for React Query integration.
 */

import { ConvexReactClient } from "convex/react";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

/**
 * Convex React Client
 *
 * Used by ConvexProviderWithAuth to connect to Convex backend.
 */
export const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL
);
