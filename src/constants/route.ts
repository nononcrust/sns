export const route = {
  home: "/",
  channel: (params: { channelId: string }) => `/channels/${params.channelId}`,
  auth: {
    login: "/login",
    signup: "/signup",
    forgotPassword: "/forgot-password",
    passwordReset: {
      request: "/reset-password",
      form: (params: { token: string }) => `/reset-password/${params.token}`,
    },
    sameEmail: "/same-email",
  },
  profile: (params: { userId: string }) => `/profile/${params.userId}`,
  account: {
    profile: "/profile",
  },
  post: {
    list: "/posts",
    detail: (params: { postId: string }) => `/posts/${params.postId}`,
    create: "/posts/add",
    edit: (params: { postId: string }) => `/posts/${params.postId}/edit`,
  },
} as const;
