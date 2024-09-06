import { route } from "@/constants/route";
import { expect, test } from "@playwright/test";

test("초기화", async ({ page }) => {
  await page.goto(route.home);

  expect(true).toBe(true);
});
