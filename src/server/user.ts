import { prisma } from "@/lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

export type GetUsersRequestQuery = z.infer<typeof GetUsersRequestQuery>;
const GetUsersRequestQuery = z.object({
  search: z.string().optional(),
  cursor: z.string().optional(),
});

export const user = new Hono()
  .get("/", zValidator("query", GetUsersRequestQuery), async (c) => {
    const { search } = c.req.valid("query");

    const users = await prisma.user.findMany({
      where: {
        nickname: {
          contains: search,
        },
      },
    });

    return c.json(users, 200);
  })
  .get("/:id", async (c) => {
    const userId = c.req.param("id");

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HTTPException(404, { message: "존재하지 않는 유저입니다." });
    }

    return c.json(user, 200);
  })
  .get("/:id/posts", async (c) => {
    const userId = c.req.param("id");

    const posts = await prisma.post.findMany({
      skip: 0,
      take: 10,
      where: {
        authorId: userId,
      },
    });

    const count = await prisma.post.count({
      where: {
        authorId: userId,
      },
    });

    return c.json(
      {
        posts: posts,
        total: count,
      },
      200,
    );
  });
