import { getAuthenticatedServerSession } from "@/features/auth/session";
import { prisma } from "@/lib/prisma";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export const following = new Hono()
  .put("/:userId", async (c) => {
    const session = await getAuthenticatedServerSession(c);

    const userId = c.req.param("userId");

    if (userId === session.userId) {
      throw new HTTPException(400, { message: "자기 자신을 팔로우할 수 없습니다." });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HTTPException(404, { message: "존재하지 않는 사용자입니다." });
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: session.userId,
        followingId: userId,
      },
    });

    return c.json(follow, 201);
  })
  .delete("/:userId", async (c) => {
    const session = await getAuthenticatedServerSession(c);

    const userId = c.req.param("userId");

    if (userId === session.userId) {
      throw new HTTPException(400, { message: "자기 자신의 팔로우를 취소할 수 없습니다." });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HTTPException(404, { message: "존재하지 않는 사용자입니다." });
    }

    const follow = await prisma.follow.deleteMany({
      where: {
        followerId: session.userId,
        followingId: userId,
      },
    });

    return c.json(follow, 200);
  });
