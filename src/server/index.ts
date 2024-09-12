import { Hono } from "hono";
import { logger } from "hono/logger";
import { auth } from "./auth";
import { comment } from "./comment";
import { following } from "./following";
import { post } from "./post";
import { profile } from "./profile";
import { user } from "./user";

export const app = new Hono()
  .basePath("/api")
  .use(logger())
  .route("/posts", post)
  .route("/comments", comment)
  .route("/auth", auth)
  .route("/profile", profile)
  .route("/users", user)
  .route("/user/following", following);

export type App = typeof app;
