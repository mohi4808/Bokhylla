import { test, expect } from "@playwright/test";
import { checkCartRow } from "./helper";

test("Select foundation", async ({ page }) => {
  test.setTimeout(4_000);
  await page.goto("http://localhost:5173/compose-salad");

  let select = page.getByRole("combobox", { name: "Välj bas" });
  await select.click();
  await page
    .getByRole("listbox")
    .getByRole("option", { name: "Pasta, 10 kr", exact: true })
    .click();
  await expect(select.getByText("Pasta, 10 kr", { exact: true })).toBeVisible();

  // Norsk fjordlax
  select = page.getByRole("combobox", { name: "Välj protein" });
  await select.click();
  await page
    .getByRole("listbox")
    .getByRole("option", { name: "Norsk fjordlax, 30 kr", exact: true })
    .click();
  await expect(
    select.getByText("Norsk fjordlax, 30 kr", { exact: true })
  ).toBeVisible();

  // Dillmayo
  select = page.getByRole("combobox", { name: "Välj dressing" });
  await select.click();
  await page
    .getByRole("listbox")
    .getByRole("option", { name: "Dillmayo, 5 kr", exact: true })
    .click();
  await expect(
    select.getByText("Dillmayo, 5 kr", { exact: true })
  ).toBeVisible();

  // Rödlök
  await expect(
    page.getByRole("checkbox", { name: "Rödlök, 5 kr" })
  ).not.toBeChecked();
  await page.getByText("Rödlök, 5 kr").click();
  await expect(
    page.getByRole("checkbox", { name: "Rödlök, 5 kr" })
  ).toBeChecked();

  // Körsbärstomater
  await expect(
    page.getByRole("checkbox", { name: "Körsbärstomater, 5 kr" })
  ).not.toBeChecked();
  await page.getByText("Körsbärstomater, 5 kr").click();
  await expect(
    page.getByRole("checkbox", { name: "Körsbärstomater, 5 kr" })
  ).toBeChecked();

  // Ruccola
  await expect(
    page.getByRole("checkbox", { name: "Ruccola, 5 kr" })
  ).not.toBeChecked();
  await page.getByText("Ruccola, 5 kr").click();
  await expect(
    page.getByRole("checkbox", { name: "Ruccola, 5 kr" })
  ).toBeChecked();

  // add salad to the cart
  await page.getByRole("button", { name: "Lägg till i varukorgen" }).click();

  // check that the form is cleared
  await expect(
    select.getByText("Pasta, 10 kr", { exact: true })
  ).not.toBeVisible();
  await expect(
    select.getByText("Norsk fjordlax, 30 kr", { exact: true })
  ).not.toBeVisible();
  await expect(
    select.getByText("Dillmayo, 5 kr", { exact: true })
  ).not.toBeVisible();
  await expect(
    page.getByRole("checkbox", { name: "Rödlök, 5 kr" })
  ).not.toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Körsbärstomater, 5 kr" })
  ).not.toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Ruccola, 5 kr" })
  ).not.toBeChecked();

  // check the last salad
  const table = page.getByRole("table");
  const rows = table.locator("tbody tr");
  await checkCartRow(rows.nth(-1), {
    text: "Pasta, Norsk fjordlax, Rödlök, Körsbärstomater, Ruccola, Dillmayo",
    vegan: 0,
    lactose: 0,
    gluten: 1,
    price: "60 kr",
  });
});
