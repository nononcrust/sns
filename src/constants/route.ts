export const route = {
  home: "/",
  channel: (params: { channelId: string }) => `/channels/${params.channelId}`,
  auth: {
    login: "/login",
    signup: "/signup",
    passwordReset: {
      request: "/reset-password",
      form: (params: { token: string }) => `/reset-password/${params.token}`,
    },
    sameEmail: "/same-email",
  },
};
