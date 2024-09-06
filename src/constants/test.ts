export const testId = {
  googleLoginButton: "google-login-button",
  emailInput: "email-input",
  passwordInput: "password-input",
  loginFormSubmitButton: "login-form-submit-button",
  profileImageDialogButton: "profile-image-dialog-button",
  profileImageInput: "profile-image-input",
  profileImageSubmitButton: "profile-image-submit-button",
  post: {
    create: {
      titleInput: "post-create-title-input",
      contentInput: "post-create-content-input",
      submitButton: "post-create-submit-button",
    },
  },
} as const;

// TODO: env로 이동
export const testAccount = {
  user: {
    email: "dev.nonon@gmail.com",
    password: "123123123",
  },
} as const;
