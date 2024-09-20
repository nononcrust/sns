import { storage, UploadFolder } from "@/lib/supabase";
import { z } from "zod";

export const postImageFileSchema = z.instanceof(File);

export const uploadImageIfExist = async (image: File | null) => {
  if (!image) {
    return null;
  }

  return await storage.uploadFile(image, UploadFolder.POST);
};

export type GetPostsRequestQuery = z.infer<typeof GetPostsRequestQuery>;
export const GetPostsRequestQuery = z.object({
  page: z.string().default("1").optional(),
  limit: z.string().default("10").optional(),
  search: z.string().default("").optional(),
  tags: z.array(z.string()).default([]).optional(),
});
