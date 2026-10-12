import { expect, test } from "vitest";
import { inventory } from "../../../src/inventory";
import { fetchInventory } from "../../../src/use-fetch-inventory";

test("fetch inventory", async () => {
  expect(await fetchInventory("http://localhost:8080")).toStrictEqual(
    inventory
  );
});
