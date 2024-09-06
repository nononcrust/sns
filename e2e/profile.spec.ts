import { route } from "@/constants/route";
import { testId } from "@/constants/test";
import { test } from "@playwright/test";
import { fixture } from "./fixtures";

test("프로필 이미지 업로드", async ({ page }) => {
  await page.goto(route.account.profile);

  await page.getByTestId(testId.profileImageDialogButton).click();
  await page.getByTestId(testId.profileImageInput).setInputFiles(fixture.profileImage);
  await page.getByTestId(testId.profileImageSubmitButton).click();
});
