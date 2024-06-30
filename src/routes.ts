/* eslint-disable @typescript-eslint/no-inferrable-types */
/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /dashboard
 * @type {string[]}
 */
export const authRoutes: string[] = ["/auth/login"];

/**
 * An array of routes that are used for the API
 * These routes will not redirect logged in users
 * @type {string[]}
 */
export const apiRoutes: string[] = ["/api/(.*)"];

/**
 * The default redirect path for logged in users
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";
