import { storage, UploadFolder } from "@/lib/supabase";
import { z } from "zod";

export const postImageFileSchema = z.instanceof(File);

export const uploadImageIfExist = async (image: File | null) => {
  if (!image) {
    return null;
  }

  return await storage.uploadFile(image, UploadFolder.POST);
};
