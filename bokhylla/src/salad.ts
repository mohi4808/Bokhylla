import {
  type IngredientInfo,
  type PartialInventory,
} from "./inventory.js";


import { v4 as uuidv4 } from "uuid";


type SaladInfo = {
  vegan: boolean;
  gluten: boolean;
  lactose: boolean;
};


class Salad {
  //protected static instanceCounter = 1;
  protected readonly ingredients: PartialInventory;
  readonly uuid;


  constructor(init?: PartialInventory, uuid?: string) {
    this.ingredients = init ?? {};
    this.uuid = uuid ?? uuidv4(); //"salad_" + Salad.instanceCounter++;
  }


  /**
   * @returns a new salad object with the ingredient @name added.
   */
  add(name: string, info: IngredientInfo): Salad {
    const newIngredients = { ...this.ingredients };
    newIngredients[name] = info;
    return new Salad(newIngredients, this.uuid);
  }


  /**
   * @returns a new salad object with the ingredient @name removed.
   */
  remove(name: string): Salad {
    const newIngredients = { ...this.ingredients };
    delete newIngredients[name];
    return new Salad(newIngredients, this.uuid);
  }


  /**
   * @returns the price of this salad.
   */
  price(): number {
    return Object.values(this.ingredients).reduce(
      (acc, values) => acc + values.price,
      0,
    );
  }
  /**
   * @returns the aggregated info of of all ingredients.
   * vegan is true if all ingredients are vegan.
   * lactose and gluten is true if any of the ingredients contain the allergenic
   */
  info(): SaladInfo {
    const newInfo: SaladInfo = { vegan: true, gluten: false, lactose: false };
    Object.values(this.ingredients).reduce((acc, value) => {
      if (value.gluten) newInfo.gluten = true;
      if (!value.vegan) newInfo.vegan = false;
      if (value.lactose) newInfo.lactose = true;
      return acc;
    }, newInfo);
    return newInfo;
  }


  getIngredients() {
    return this.ingredients;
  }


  /**
   * @param json is a JSON string with an array of Salad objects
   * @returns an array of Salad objects.
   * @throws if json is not an array, or any of the objects do not
   * have the ingredients attribute
   */
  static parse(json: string): Salad[] {
    const list = JSON.parse(json);
    if (!Array.isArray(list)) {
      throw new Error("Not an array");
    }
    for (const item of list) {
      // in list?
      if (!("ingredients" in item)) {
        throw new Error("No ingredients in list");
      }
    }
    const saladList = list.map((x) => new Salad(x.ingredients, x.uuid));
    return saladList;
  }
}


export { Salad };


