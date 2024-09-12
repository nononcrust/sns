export const fileConfig = {
  maxFileSize: {
    post: 5 * 1024 * 1024,
    profile: 2 * 1024 * 1024,
  },
  allowedImageTypes: {
    post: ["image/jpeg", "image/png", "image/webp"].join(","),
    profile: ["image/jpeg", "image/png", "image/webp"].join(","),
  },
} as const;
