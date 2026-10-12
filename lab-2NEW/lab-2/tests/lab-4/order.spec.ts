import { test, expect, Page } from "@playwright/test";
import { checkCartRow } from "../lab-2/helper";

test("Order a salad", async ({ page }) => {
  await page.goto("http://localhost:5173/view-cart");
  await page.evaluate(() =>
    localStorage.setItem(
      "cart",
      `[
    {"ingredients": {
      "Dillmayo": { "price": 5, "type": "dressing" },
      "Körsbärstomater": { "price": 5, "type": "extra", "vegan": true },
      "Norsk fjordlax": { "price": 30, "type": "protein" },
      "Pasta": { "gluten": true, "price": 10, "type": "foundation" },
      "Ruccola": { "price": 5, "type": "extra", "vegan": true },
      "Rödlök": { "price": 5, "type": "extra", "vegan": true }
    },
    "uuid": "salad-1"}
  ]`
    )
  );
  await page.reload();
  await expect(page.getByRole("table").locator("tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "Skicka beställningen" }).click();
  await expect(page.getByText("confirmed")).toBeVisible();
  await expect(page.getByRole("table").locator("tbody tr")).toHaveCount(0);
});

async function composeSalad(page: Page) {
  let select = page.getByRole("combobox", { name: "Välj bas" });
  await select.click();
  await page
    .getByRole("listbox")
    .getByRole("option", { name: "Pasta, 10 kr", exact: true })
    .click();

  // Norsk fjordlax
  select = page.getByRole("combobox", { name: "Välj protein" });
  await select.click();
  await page
    .getByRole("listbox")
    .getByRole("option", { name: "Norsk fjordlax, 30 kr", exact: true })
    .click();

  // Dillmayo
  select = page.getByRole("combobox", { name: "Välj dressing" });
  await select.click();
  await page
    .getByRole("listbox")
    .getByRole("option", { name: "Dillmayo, 5 kr", exact: true })
    .click();

  // Rödlök
  await expect(
    page.getByRole("checkbox", { name: "Rödlök, 5 kr" })
  ).not.toBeChecked();
  await page.getByText("Rödlök, 5 kr").click();

  // Körsbärstomater
  await expect(
    page.getByRole("checkbox", { name: "Körsbärstomater, 5 kr" })
  ).not.toBeChecked();
  await page.getByText("Körsbärstomater, 5 kr").click();

  // Ruccola
  await page.getByText("Ruccola, 5 kr").click();

  // add salad to the cart
  await page.getByRole("button", { name: "Lägg till i varukorgen" }).click();
}
