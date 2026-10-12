import { test, expect } from "@playwright/test";

test("Render the navigation menu", async ({ page }) => {
  await page.goto("http://localhost:5173/page-not-found");
  await expect(
    page.getByRole("link", { name: "Hem", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Skapa sallad", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Varukorgen", exact: true })
  ).toBeVisible();
});

test("Navigate to Home", async ({ page }) => {
  await page.goto("http://localhost:5173/page-not-found");
  await page.getByRole("link", { name: "Hem", exact: true }).click();
  await page.waitForURL("**/");
  await expect(page.getByText("Välkommen till min salladsbar")).toBeVisible();
  await expect(
    page.getByText("Välj de ingredienser som ingår i salladen.")
  ).not.toBeVisible();
  await expect(
    page.getByText("Här listas alla sallader du skapat.")
  ).not.toBeVisible();
  await expect(page.getByText("Sidan kunde inte hittas")).not.toBeVisible();
});

test("Navigate to Compose Salad", async ({ page }) => {
  await page.goto("http://localhost:5173/page-not-found");
  await page.getByRole("link", { name: "Skapa sallad", exact: true }).click();
  await page.waitForURL("**/compose-salad");
  await expect(
    page.getByText("Välkommen till min salladsbar")
  ).not.toBeVisible();
  await expect(
    page.getByText("Välj de ingredienser som ingår i salladen.")
  ).toBeVisible();
  await expect(
    page.getByText("Här listas alla sallader du skapat.")
  ).not.toBeVisible();
  await expect(page.getByText("Sidan kunde inte hittas")).not.toBeVisible();
});

test("Navigate to Shopping Cart", async ({ page }) => {
  await page.goto("http://localhost:5173/page-not-found");
  await page.getByRole("link", { name: "Varukorgen", exact: true }).click();
  await page.waitForURL("**/view-cart");
  await expect(
    page.getByText("Välkommen till min salladsbar")
  ).not.toBeVisible();
  await expect(
    page.getByText("Välj de ingredienser som ingår i salladen.")
  ).not.toBeVisible();
  await expect(
    page.getByText("Här listas alla sallader du skapat.")
  ).toBeVisible();
  await expect(page.getByText("Sidan kunde inte hittas")).not.toBeVisible();
});

test("Navigate to Page Not Found", async ({ page }) => {
  await page.goto("http://localhost:5173/bad-url");
  await expect(
    page.getByText("Välkommen till min salladsbar")
  ).not.toBeVisible();
  await expect(
    page.getByText("Välj de ingredienser som ingår i salladen.")
  ).not.toBeVisible();
  await expect(
    page.getByText("Här listas alla sallader du skapat.")
  ).not.toBeVisible();
  await expect(page.getByText("Sidan kunde inte hittas")).toBeVisible();
});
