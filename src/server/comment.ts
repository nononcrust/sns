import { getAuthenticatedServerSession } from "@/features/auth/session";
import { prisma } from "@/lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { ReportType } from "@prisma/client";
import { Hono } from "hono";
import { z } from "zod";

type CreateCommentReportRequestBody = z.infer<typeof CreateCommentReportRequestBody>;
const CreateCommentReportRequestBody = z.object({
  type: z.nativeEnum(ReportType),
});

export const comment = new Hono().post(
  "/:id/report",
  zValidator("json", CreateCommentReportRequestBody),
  async (c) => {
    const body = c.req.valid("json");

    const postId = c.req.param("id");

    const session = await getAuthenticatedServerSession(c);

    const report = await prisma.report.create({
      data: {
        type: body.type,
        reporterId: session.userId,
        postId: postId,
      },
    });

    return c.json(report, 201);
  },
);
