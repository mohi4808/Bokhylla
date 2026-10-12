import { test, expect } from "@playwright/test";
import { checkCartRow } from "./helper";

test("Show error for empty form", async ({ page }) => {
  await page.goto("http://localhost:5173/compose-salad");

  const foundationSelect = page.getByRole("combobox", { name: "Välj bas" });
  const proteinSelect = page.getByRole("combobox", { name: "Välj protein" });
  const dressingSelect = page.getByRole("combobox", { name: "Välj dressing" });
  // no errors are shown when the page is loaded
  await Promise.all([
    expect(foundationSelect).toHaveAttribute("aria-invalid", "false"),
    expect(proteinSelect).toHaveAttribute("aria-invalid", "false"),
    expect(dressingSelect).toHaveAttribute("aria-invalid", "false"),
    expect(page.getByText("För få extra ingredienser")).not.toBeVisible(),
  ]);

  const submitButton = page.getByRole("button", {
    name: "Lägg till i varukorgen",
  });
  await submitButton.click();

  // errors are shown after submitting the form
  await Promise.all([
    expect(proteinSelect).toHaveAttribute("aria-invalid", "true"),
    expect(dressingSelect).toHaveAttribute("aria-invalid", "true"),
    expect(page.getByText("För få extra ingredienser")).toBeVisible(),
  ]);

  // fill form to fix form errors, check that the error is removed
  // Pasta, 10 kr
  await foundationSelect.click();
  await page
    .getByRole("listbox")
    .getByRole("option", { name: "Pasta, 10 kr", exact: true })
    .click();
  await expect(foundationSelect).toHaveAttribute("aria-invalid", "false");

  // Norsk fjordlax
  let select = page.getByRole("combobox", { name: "Välj protein" });
  await select.click();
  await page
    .getByRole("listbox")
    .getByRole("option", { name: "Norsk fjordlax, 30 kr", exact: true })
    .click();
  await expect(proteinSelect).toHaveAttribute("aria-invalid", "false");

  // Dillmayo
  select = page.getByRole("combobox", { name: "Välj dressing" });
  await select.click();
  await page
    .getByRole("listbox")
    .getByRole("option", { name: "Dillmayo, 5 kr", exact: true })
    .click();
  await expect(dressingSelect).toHaveAttribute("aria-invalid", "false");

  // select two extras
  await page.getByText("Rödlök, 5 kr").click();
  await page.getByText("Körsbärstomater, 5 kr").click();
  await expect(page.getByText("För få extra ingredienser")).not.toBeVisible();

  // add salad to the cart
  await page.getByRole("button", { name: "Lägg till i varukorgen" }).click();

  // check navigation
  await page.waitForURL("**/view-cart/**");

  // check the last salad
  const table = page.getByRole("table");
  const row = table.locator("tbody tr").nth(-1);
  await Promise.all([
    checkCartRow(row, {
      ingredients: [
        "Pasta",
        "Norsk fjordlax",
        "Rödlök",
        "Körsbärstomater",
        "Dillmayo",
      ],
      vegan: 0,
      lactose: 0,
      gluten: 1,
      price: "55 kr",
    }),
    expect(row.getByText("Ny", { exact: true })).toBeVisible(),
    expect(page.getByText("En ny sallad har lagts till i")).toBeVisible(),
  ]);
  await page.goto("http://localhost:5173/view-cart/new/bad-uuid");
  await expect(page.getByText("Felaktig url.")).toBeVisible();
});
