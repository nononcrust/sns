import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { env } from "../env";

export enum UploadFolder {
  POST = "post",
  COMMENT = "comment",
  USER_PROFILE = "profile",
}

const supabase = createClient(env.SUPABASE_PROJECT_URL, env.SUPABASE_SERVICE_KEY);

const uploadFile = async (file: File, folder: UploadFolder) => {
  const path = `${folder}/${nanoid()}`;

  const { data, error } = await supabase.storage.from(env.SUPABASE_BUCKET_NAME).upload(path, file);

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
};

const deleteFiles = async (paths: string[]) => {
  const { error } = await supabase.storage.from(env.SUPABASE_BUCKET_NAME).remove(paths);

  if (error) {
    throw new Error(error.message);
  }
};

const getPublicUrl = (path: string) => {
  return supabase.storage.from(env.SUPABASE_BUCKET_NAME).getPublicUrl(path).data.publicUrl;
};

const getFilePathFromPublicUrl = (publicUrl: string) => {
  return publicUrl.replace(
    `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/${env.SUPABASE_BUCKET_NAME}/`,
    "",
  );
};

const uploadFileIfExist = async (file: File | null, folder: UploadFolder) => {
  if (!file) {
    return null;
  }

  return await uploadFile(file, folder);
};

export const storage = {
  uploadFile,
  deleteFiles,
  getPublicUrl,
  getFilePathFromPublicUrl,
  uploadFileIfExist,
};
