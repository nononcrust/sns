import { Hono } from "hono";
import { logger } from "hono/logger";
import { auth } from "./auth";
import { post } from "./post";
import { profile } from "./profile";

export const app = new Hono()
  .basePath("/api")
  .use(logger())
  .route("/posts", post)
  .route("/auth", auth)
  .route("/profile", profile);

export type App = typeof app;
