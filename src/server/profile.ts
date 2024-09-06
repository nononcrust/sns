import { getServerSession } from "@/features/auth/session";
import { prisma } from "@/lib/prisma";
import { storage, UploadFolder } from "@/lib/supabase";
import { UpdateProfileImageRequestBody } from "@/services/profile";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export const profile = new Hono()
  .get("/", async (c) => {
    const session = await getServerSession(c);

    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: session.userId,
      },
    });

    return c.json(user, 200);
  })
  .patch("/image", zValidator("form", UpdateProfileImageRequestBody), async (c) => {
    const session = await getServerSession(c);

    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const body = c.req.valid("form");

    const existingUser = await prisma.user.findUniqueOrThrow({ where: { id: session.userId } });

    if (existingUser.profileImage) {
      await storage.deleteFiles([storage.getFilePathFromPublicUrl(existingUser.profileImage)]);
    }

    const uploadedFile = await storage.uploadFile(body.profileImage, UploadFolder.USER_PROFILE);

    await prisma.user.update({
      where: { id: session.userId },
      data: { profileImage: storage.getPublicUrl(uploadedFile.path) },
    });

    return c.json(200);
  });
