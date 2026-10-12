type IngredientType = "foundation" | "protein" | "extra" | "dressing";

interface IngredientInfo {
  readonly type: IngredientType;
  readonly price: number;
  readonly vegan?: boolean;
  readonly gluten?: boolean;
  readonly lactose?: boolean;
}

const baseInventory = {
  Sallad: { price: 10, type: "foundation", vegan: true },
  Pasta: { price: 10, type: "foundation", gluten: true },
  "Sallad + Pasta": { price: 10, type: "foundation", gluten: true },
  "Sallad + Matvete": {
    price: 10,
    type: "foundation",
    vegan: true,
    gluten: true,
  },
  "Sallad + Glasnudlar": { price: 10, type: "foundation", gluten: true },
  "Sallad + Quinoa": { price: 10, type: "foundation", vegan: true },

  Kycklingfilé: { price: 10, type: "protein" },
  "Rökt kalkonfilé": { price: 10, type: "protein" },
  "Norsk fjordlax": { price: 30, type: "protein" },
  "Handskalade räkor från Smögen": { price: 40, type: "protein" },
  "Pulled beef från Sverige": { price: 15, type: "protein" },
  "Marinerad bönmix": { price: 10, type: "protein", vegan: true },

  Avocado: { price: 10, type: "extra", vegan: true },
  Bacon: { price: 10, type: "extra" },
  Böngroddar: { price: 5, type: "extra", vegan: true },
  Cashewnötter: { price: 5, type: "extra", vegan: true },
  Chèvreost: { price: 15, type: "extra", lactose: true },
  Fetaost: { price: 5, type: "extra", lactose: true },
  "Färsk koriander": { price: 10, type: "extra", vegan: true },
  Gurka: { price: 5, type: "extra", vegan: true },
  "Inlagd lök": { price: 5, type: "extra", vegan: true },
  Jalapeno: { price: 5, type: "extra", vegan: true },
  "Krossade jordnötter": { price: 5, type: "extra", vegan: true },
  Krutonger: { price: 5, type: "extra", gluten: true },
  Körsbärstomater: { price: 5, type: "extra", vegan: true },
  Lime: { price: 5, type: "extra", vegan: true },
  Majs: { price: 5, type: "extra", vegan: true },
  Oliver: { price: 5, type: "extra", vegan: true },
  Paprika: { price: 5, type: "extra", vegan: true },
  Parmesan: { price: 5, type: "extra", lactose: true },
  "Rivna morötter": { price: 5, type: "extra", vegan: true },
  "Rostade sesamfrön": { price: 5, type: "extra", vegan: true },
  Ruccola: { price: 5, type: "extra", vegan: true },
  Rödlök: { price: 5, type: "extra", vegan: true },
  Sojabönor: { price: 5, type: "extra", vegan: true },
  "Soltorkad tomat": { price: 5, type: "extra", vegan: true },
  Tomat: { price: 5, type: "extra", vegan: true },
  Valnötter: { price: 5, type: "extra", vegan: true },
  Ägg: { price: 5, type: "extra" },

  Ceasardressing: { price: 5, type: "dressing", lactose: true },
  Dillmayo: { price: 5, type: "dressing" },
  Honungsdijon: { price: 5, type: "dressing", vegan: true },
  Kimchimayo: { price: 5, type: "dressing" },
  Pesto: { price: 5, type: "dressing", lactose: true },
  Rhodeisland: { price: 5, type: "dressing", lactose: true },
  "Rostad aioli": { price: 5, type: "dressing" },
  Soyavinägrett: { price: 5, type: "dressing", vegan: true },
  Örtvinägrett: { price: 5, type: "dressing", vegan: true },
};
type IngredientName = keyof typeof baseInventory;
type Inventory = Readonly<
  Record<IngredientName, IngredientInfo> & {
    [otherName: string]: IngredientInfo;
  }
>;
const inventory: Inventory = baseInventory as Inventory;
type PartialInventory = Readonly<Record<keyof Inventory, IngredientInfo>>;

// recursively freeze the data structure.
function deepFreeze(obj: object) {
  Object.values(obj).forEach(
    (prop) => prop && typeof prop === "object" && deepFreeze(prop)
  );
  Object.freeze(obj);
}
deepFreeze(baseInventory);

export {
  inventory,
  type Inventory,
  type IngredientType,
  type IngredientInfo,
  type PartialInventory,
};
