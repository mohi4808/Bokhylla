import { expect, Locator } from "playwright/test";

export async function checkCartRow(
  row: Locator,
  salad: {
    ingredients: string[];
    vegan: number;
    lactose: number;
    gluten: number;
    price: string;
    notIngredients?: string[];
  }
) {
  const cells = row.locator("td");
  await Promise.all(
    salad.ingredients.map((text) =>
      expect(cells.nth(0).getByText(text)).toBeVisible()
    )
  );
  await Promise.all([
    expect(cells.nth(1).locator("//div/*[local-name()='svg']")).toHaveCount(
      salad.vegan
    ),
    expect(cells.nth(2).locator("//div/*[local-name()='svg']")).toHaveCount(
      salad.lactose
    ),
    expect(cells.nth(3).locator("//div/*[local-name()='svg']")).toHaveCount(
      salad.gluten
    ),
    expect(cells.nth(4).getByText(salad.price)).toBeVisible(),
  ]);
  if (salad.notIngredients) {
    await Promise.all(
      salad.notIngredients.map((name) =>
        expect(cells.nth(0).getByText(name)).not.toBeVisible()
      )
    );
  }
}
