import { type AppRouter } from "@/server/hono/root";
import { hc as honoClient } from "hono/client";

export const hono = honoClient<AppRouter>(`${getBaseUrl()}/api/hono`);

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
