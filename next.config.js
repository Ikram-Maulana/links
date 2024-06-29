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
};

export default config;
