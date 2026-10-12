import { test, expect, Page } from "@playwright/test";
import { checkCartRow } from "../lab-2/helper";

const initialCart = [
  {
    ingredients: {
      "Sallad + Quinoa": { price: 10, type: "foundation", vegan: true },
      Kycklingfilé: { price: 10, type: "protein" },
      Fetaost: { price: 5, type: "extra", lactose: true },
      Sojabönor: { price: 5, type: "extra", vegan: true },
      Cashewnötter: { price: 5, type: "extra", vegan: true },
      Ceasardressing: { price: 5, type: "dressing", lactose: true },
    },
    uuid: "bf9474f0-db2c-4562-b21b-3cc798e9e141",
  },
  {
    ingredients: {
      Pasta: { price: 10, type: "foundation", gluten: true },
      "Norsk fjordlax": { price: 30, type: "protein" },
      Ruccola: { price: 5, type: "extra", vegan: true },
      Rödlök: { price: 5, type: "extra", vegan: true },
      Körsbärstomater: { price: 5, type: "extra", vegan: true },
      Paprika: { price: 5, type: "extra", vegan: true },
      Dillmayo: { price: 5, type: "dressing" },
    },
    uuid: "2fbbc2f5-25fb-499c-b0f1-35f114a3c88f",
  },
];

test("Load cart from localstorage", async ({ page }) => {
  await page.goto("http://localhost:5173/view-cart");
  await page.evaluate(
    (cart) => localStorage.setItem("cart", JSON.stringify(cart)),
    initialCart
  );
  await page.reload();
  // check the first salad
  const rows = page.getByRole("table").locator("tbody tr");
  await Promise.all([
    expect(rows).toHaveCount(2),
    checkCartRow(rows.nth(0), {
      ingredients: Object.keys(initialCart[0].ingredients),
      vegan: 0,
      lactose: 1,
      gluten: 0,
      price: "40 kr",
    }),
  ]);
});

test("Store cart in localstorage", async ({ page }) => {
  await page.goto("http://localhost:5173/compose-salad");
  await page.evaluate(() => localStorage.removeItem("cart"));
  await page.reload();
  await composeSalad(page);
  await page.goto("http://localhost:5173/view-cart");
  expect(
    await page.evaluate(() => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      return cart.map((salad: any) => salad.ingredients);
    })
  ).toStrictEqual([
    {
      Dillmayo: { price: 5, type: "dressing" },
      Körsbärstomater: { price: 5, type: "extra", vegan: true },
      "Norsk fjordlax": { price: 30, type: "protein" },
      Pasta: { gluten: true, price: 10, type: "foundation" },
      Ruccola: { price: 5, type: "extra", vegan: true },
      Rödlök: { price: 5, type: "extra", vegan: true },
    },
  ]);
  page.reload();
  // check the last salad
  const table = page.getByRole("table");
  const rows = table.locator("tbody tr");
  await Promise.all([
    expect(rows).toHaveCount(1),
    checkCartRow(rows.nth(-1), {
      ingredients: [
        "Pasta",
        "Norsk fjordlax",
        "Rödlök",
        "Körsbärstomater",
        "Ruccola",
        "Dillmayo",
      ],
      vegan: 0,
      lactose: 0,
      gluten: 1,
      price: "60 kr",
    }),
  ]);
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
