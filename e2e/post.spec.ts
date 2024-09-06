import { route } from "@/constants/route";
import { testId } from "@/constants/test";
import { faker } from "@/lib/faker";
import { expect, test } from "@playwright/test";

test("게시글 생성", async ({ page }) => {
  await page.goto(route.post.create);

  const title = faker.lorem.sentence();
  const content = faker.lorem.paragraph();

  await page.getByTestId(testId.post.create.titleInput).fill(title);
  await page.getByTestId(testId.post.create.contentInput).fill(content);
  await page.getByTestId(testId.post.create.submitButton).click();
  await page.waitForURL(route.post.list);

  const createdPostTitle = page.getByText(title);
  expect(createdPostTitle).not.toBeNull();
});
