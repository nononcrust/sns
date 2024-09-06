import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "./shared";

const queryKey = "/profile";

const ProfileImage = z.instanceof(File).refine((file) => file.size < 1024 * 1024 * 2, {
  message: "2MB 이하의 파일을 업로드해주세요.",
});

type UpdateProfileImageRequestBody = z.infer<typeof UpdateProfileImageRequestBody>;
export const UpdateProfileImageRequestBody = z.object({
  profileImage: ProfileImage,
});

type UpdateProfileImageRequest = {
  body: UpdateProfileImageRequestBody;
};

export const profileService = {
  useProfile: () => {
    return useQuery({
      queryKey: [queryKey],
      queryFn: async () => {
        const response = await api.profile.$get();
        return await response.json();
      },
    });
  },
  useUpdateProfileImage: () => {
    return useMutation({
      mutationFn: api.profile.image.$patch,
    });
  },
};
