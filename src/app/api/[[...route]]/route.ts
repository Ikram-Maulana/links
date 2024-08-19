import { appRouter } from "@/server/hono/root";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api/hono");

app.use(cors());
app.route("/", appRouter);

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
