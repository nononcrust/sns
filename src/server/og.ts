import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import ky from "ky";
import { z } from "zod";

const GetOgRequestQuery = z.object({
  url: z.string().min(1).url(),
});

export const og = new Hono().get("/", zValidator("query", GetOgRequestQuery), async (c) => {
  const queryParams = c.req.valid("query");

  const response = await ky.get(queryParams.url);

  const html = await response.text();

  const title = html.match(/<title>(.*?)<\/title>/)?.[1];

  const description = html.match(/<meta name="description" content="(.*?)">/)?.[1];

  const imageUrl = html.match(/<meta property="og:image" content="(.*?)">/)?.[1];

  const url = queryParams.url;

  c.json({ title, description, imageUrl, url }, 200);
});
