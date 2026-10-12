import { test, expect } from "@playwright/test"

test("has title", async ({ page }) => {
  test.setTimeout(10_000);
  await page.goto("http://localhost:5173/")

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/EDAF90/)
  await expect(
    page.getByRole("heading", { name: "Min egen salladsbar" })
  ).toBeVisible()
})
