import { test, expect } from "@playwright/test";
import { checkCartRow } from "./helper";
const salads = [
  {
    text: "Sallad, Kycklingfilé, Bacon, Krutonger, Parmesan, Ceasardressing, Gurka",
    vegan: 0,
    lactose: 1,
    gluten: 1,
    price: "50 kr",
  },
  {
    text: "Sallad + Quinoa, Kycklingfilé, Cashewnötter, Fetaost, Sojabönor, Ceasardressing",
    vegan: 0,
    lactose: 1,
    gluten: 0,
    price: "40 kr",
  },
  {
    text: "Sallad, Marinerad bönmix, Avocado, Lime, Örtvinägrett",
    vegan: 1,
    lactose: 0,
    gluten: 0,
    price: "40 kr",
  },
];

test("Render initial cart", async ({ page }) => {
  test.setTimeout(4_000);
  await page.goto("http://localhost:5173/view-cart");

  await expect(page.getByText("Varukorgen", { exact: true })).toBeVisible();

  // Locate the table
  const table = page.getByRole("table");

  // Count total rows inside tbody
  const rows = table.locator("tbody tr");
  // 3 salad rows
  await expect(rows).toHaveCount(3);

  await Promise.all(
    salads.map((salad, index) => checkCartRow(rows.nth(index), salad))
  );
  await expect(
    table.locator("tfoot tr td").nth(1).getByText("130 kr")
  ).toBeVisible();
});
