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
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/ancika/static/:path*",
        destination: "https://ancika.ikrammaulana.my.id/static/:path*",
      },
      {
        source: "/ancika/:path*",
        destination: "https://ancika.ikrammaulana.my.id/:path*",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default config;
