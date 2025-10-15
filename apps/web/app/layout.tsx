import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@jn7fqjwvd2xww9rw4304asgdw57shp08/components";

export const metadata: Metadata = {
  title: "Todo App - Minimal Task Management",
  description: "A minimal, production-ready todo list application built with Convex, Better Auth, and Next.js",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
