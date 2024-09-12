import { getServerSession } from "@/features/auth/session";
import { prisma } from "@/lib/prisma";

import { storage, UploadFolder } from "@/lib/supabase";
import { zValidator } from "@hono/zod-validator";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { postImageFileSchema } from "./utils";

export type GetPostsRequestQuery = z.infer<typeof GetPostsRequestQuery>;
export const GetPostsRequestQuery = z.object({
  page: z.string().default("1").optional(),
  limit: z.string().default("10").optional(),
  search: z.string().default("").optional(),
  tags: z.array(z.string()).default([]).optional(),
});

type CreatePostRequestBody = z.infer<typeof CreatePostRequestBody>;
const CreatePostRequestBody = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  image: postImageFileSchema.optional(),
  alt: z.string().min(1).optional(),
});

type UpdatePostRequestBody = z.infer<typeof UpdatePostRequestBody>;
const UpdatePostRequestBody = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

type CreateCommentRequestBody = z.infer<typeof CreateCommentRequestBody>;
const CreateCommentRequestBody = z.object({
  content: z.string().min(1),
  image: postImageFileSchema.optional(),
});

const defaultQuery = {
  page: "1",
  limit: "10",
  search: "",
  tags: [],
} as const;

export const post = new Hono()
  .get("/", zValidator("query", GetPostsRequestQuery), async (c) => {
    const queryParams = c.req.valid("query");

    const query = {
      page: queryParams.page ?? defaultQuery.page,
      limit: queryParams.limit ?? defaultQuery.limit,
      search: queryParams.search ?? defaultQuery.search,
      tags: queryParams.tags ?? defaultQuery.tags,
    } as const;

    const posts = await prisma.post.findMany({
      take: Number(query.limit),
      skip: (Number(query.page) - 1) * Number(query.limit),
      where: {
        title: {
          contains: query.search,
        },
      },
      include: {
        images: true,
        author: true,
        likes: {
          include: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const postCount = await prisma.post.count();

    return c.json(
      {
        posts: posts,
        total: postCount,
      },
      200,
    );
  })
  .get("/:id", async (c) => {
    try {
      const postId = c.req.param("id");

      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          view: {
            increment: 1,
          },
        },
      });

      const post = await prisma.post.findUniqueOrThrow({
        where: {
          id: postId,
        },
        include: {
          author: true,
          images: true,
        },
      });

      return c.json(post, 200);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HTTPException(404, { message: "존재하지 않는 게시글입니다." });
      }

      throw new HTTPException(500, { message: "서버 에러" });
    }
  })
  .post("/", zValidator("form", CreatePostRequestBody), async (c) => {
    const session = await getServerSession(c);

    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const body = c.req.valid("form");

    const uploadedImage = await storage.uploadFileIfExist(body.image ?? null, UploadFolder.POST);

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: session.userId,
        ...(uploadedImage && {
          images: {
            create: {
              url: storage.getPublicUrl(uploadedImage.path),
              alt: body.alt,
            },
          },
        }),
      },
    });

    return c.json(post, 201);
  })
  .put("/:id", zValidator("json", UpdatePostRequestBody), async (c) => {
    const session = await getServerSession(c);

    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const postId = c.req.param("id");

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new HTTPException(404, { message: "존재하지 않는 게시글입니다." });
    }

    const authorId = post.authorId;

    if (session.userId !== authorId) {
      throw new HTTPException(403, { message: "게시글을 수정할 권한이 없습니다." });
    }

    const body = c.req.valid("json");

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json(updatedPost, 200);
  })
  .delete("/:id", async (c) => {
    const postId = c.req.param("id");

    const session = await getServerSession(c);

    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new HTTPException(404, { message: "존재하지 않는 게시글입니다." });
    }

    const authorId = post.authorId;

    if (session.userId !== authorId) {
      throw new HTTPException(403, { message: "게시글을 삭제할 권한이 없습니다." });
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return c.json(undefined, 204);
  })
  .get("/:id/comments", async (c) => {
    const postId = c.req.param("id");

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
        author: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json(comments, 200);
  })
  .post("/:id/comments", zValidator("form", CreateCommentRequestBody), async (c) => {
    const body = c.req.valid("form");

    const session = await getServerSession(c);

    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const postId = c.req.param("id");

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new HTTPException(404, { message: "존재하지 않는 게시글입니다." });
    }

    const uploadedImage = await storage.uploadFileIfExist(body.image ?? null, UploadFolder.COMMENT);

    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        authorId: session.userId,
        postId: postId,
        ...(uploadedImage && {
          images: {
            create: {
              url: storage.getPublicUrl(uploadedImage.path),
            },
          },
        }),
      },
    });

    return c.json(comment, 201);
  })
  .delete("/:id/comments/:commentId", async (c) => {
    const postId = c.req.param("id");
    const commentId = c.req.param("commentId");

    const session = await getServerSession(c);

    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
        post: {
          id: postId,
        },
      },
    });

    if (!comment) {
      throw new HTTPException(404, { message: "존재하지 않는 댓글입니다." });
    }

    if (comment.authorId !== session.userId) {
      throw new HTTPException(403, { message: "댓글을 삭제할 권한이 없습니다." });
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
        post: {
          id: postId,
        },
      },
    });

    return c.json(undefined, 204);
  });
