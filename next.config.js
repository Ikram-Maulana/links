import createJiti from "jiti";
import { fileURLToPath } from "node:url";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
const jiti = createJiti(fileURLToPath(import.meta.url));
jiti("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ucarecdn.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/s/:slug",
        destination: "/api/hono/short/:slug",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ancika.js",
        destination: "https://ancika.ikrammaulana.my.id/api/ancika",
      },
    ];
  },
  crossOrigin: "anonymous",
  skipTrailingSlashRedirect: true,
};

export default config;
