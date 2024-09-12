import { Hono } from "hono";
import { logger } from "hono/logger";
import { auth } from "./auth";
import { post } from "./post";
import { profile } from "./profile";
import { user } from "./user";

export const app = new Hono()
  .basePath("/api")
  .use(logger())
  .route("/posts", post)
  .route("/auth", auth)
  .route("/profile", profile)
  .route("/users", user);

export type App = typeof app;
