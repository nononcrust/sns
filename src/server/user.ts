import { getServerSession } from "@/features/auth/session";
import { prisma } from "@/lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { GetPostsRequestQuery } from "./utils";

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
  .get("/:id/posts", zValidator("query", GetPostsRequestQuery), async (c) => {
    const userId = c.req.param("id");

    const queryParams = c.req.valid("query");

    const session = await getServerSession(c);

    const query = {
      page: queryParams.page ?? "1",
      limit: queryParams.limit ?? "10",
      search: queryParams.search ?? "",
      tags: queryParams.tags ?? [],
    };

    const posts = await prisma.post.findMany({
      take: Number(query.limit),
      skip: (Number(query.page) - 1) * Number(query.limit),
      where: {
        authorId: userId,
        title: {
          contains: query.search,
        },
      },
      include: {
        images: true,
        author: true,
        likes: session
          ? {
              where: {
                userId: session.userId,
              },
              select: {
                id: true,
              },
            }
          : false,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const postCount = await prisma.post.count();

    const postsWithLike = posts.map((post) => {
      const { likes, ...rest } = post;

      return {
        ...rest,
        isLiked: likes?.length > 0,
      };
    });

    return c.json(
      {
        posts: postsWithLike,
        total: postCount,
      },
      200,
    );
  });
