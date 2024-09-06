import { route } from "@/constants/route";
import { testAccount, testId } from "@/constants/test";
import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto(route.auth.login);
  await page.getByTestId(testId.emailInput).fill(testAccount.user.email);
  await page.getByTestId(testId.passwordInput).fill(testAccount.user.password);
  await page.getByTestId(testId.loginFormSubmitButton).click();

  await page.waitForURL(route.home);

  await page.context().storageState({ path: authFile });
});
