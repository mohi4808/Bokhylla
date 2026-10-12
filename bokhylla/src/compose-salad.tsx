import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

import { Checkbox } from "./components/ui/checkbox";
import { useNavigate } from "react-router";

import type { IngredientType, Inventory, PartialInventory } from "@/inventory";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Salad } from "./salad";
import { useOutletContext } from "react-router";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Alert, AlertTitle, AlertDescription} from "./components/ui/alert";
import { AlertCircleIcon } from "lucide-react";


type SelectOption = {
  label: string;
  value: string;
};

const cardHead = (
  <CardHeader>
    <CardTitle>Skapa din sallad</CardTitle>
    <CardDescription>Välj de ingredienser som ingår i salladen.</CardDescription>
  </CardHeader>
);

/**
 * @returns an array with all names of ingridients with the given @type
 */
function makeOptions(
  type: IngredientType,
  inventory: Inventory
): SelectOption[] {
  return Object.keys(inventory)
    .filter((name) => inventory[name].type === type)
    .map((name) => ({
      value: name,
      label: `${name}, ${inventory[name].price} kr`,
    }));
}

type PropType = {
  inventory: Inventory;
  addSalad: (salad: Salad) => void
};
function ComposeSalad() {
  const { addSalad } = useOutletContext<PropType>();
  const { inventory } = useOutletContext<PropType>();
  const navigate = useNavigate();

  const [foundation, setFoundation] = useState<SelectOption | null>(null);
  const [protein, setProtein] = useState<SelectOption | null>(null);
  const [extra, setExtra] = useState<PartialInventory>({});
  const [dressing, setDressing] = useState<SelectOption | null>(null);
  const [showError, setShowError] = useState(false);

  const foundationOptions = makeOptions("foundation", inventory);
  const proteinOptions = makeOptions("protein", inventory);
  const extraOptions = makeOptions("extra", inventory);
  const dressingOptions = makeOptions("dressing", inventory);

  function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();

    const extraCount = Object.keys(extra).length

    let newSalad = new Salad()

    if (foundation && protein && extraCount >= 2 && dressing) {
      newSalad = newSalad.add(foundation.value, inventory[foundation.value]);
      newSalad = newSalad.add(protein.value, inventory[protein.value]);

      for (const name in extra) {
        newSalad = newSalad.add(name, extra[name]);
      }

      newSalad = newSalad.add(dressing.value, inventory[dressing.value]);
      addSalad(newSalad);

      setFoundation(null);
      setDressing(null);
      setExtra({});
      setProtein(null);
      navigate(`/view-cart/new/${newSalad.uuid}`);
    } else {
      setShowError(true);
    }
  }

  return (
    <Card className="w-full p-3">
      {cardHead}
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <SelectIngredient
            label="Välj bas"
            value={foundation}
            options={foundationOptions}
            onValueChange={setFoundation}
            showError={showError}
          ></SelectIngredient>
          <SelectIngredient
            label="Välj protein"
            value={protein}
            options={proteinOptions}
            onValueChange={setProtein}
            showError={showError}
          ></SelectIngredient>
          <ExtraIngredients
            options={extraOptions}
            extra={extra}
            onCheckedChange={(name, isChecked) => {
              const newExtra = { ...extra };
              if (isChecked) {
                newExtra[name] = inventory[name];
              } else {
                delete newExtra[name];
              }
              setExtra(newExtra);
            }}
            showError={showError} />
          <SelectIngredient
            label="Välj dressing"
            value={dressing}
            options={dressingOptions}
            onValueChange={setDressing}
            showError={showError}
          ></SelectIngredient>
          <Button type="submit" className={"float-right"}>
            Lägg till i varukorgen
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type SelectIngredientType = {
  label: string;
  value: SelectOption | null;
  onValueChange: (value: SelectOption | null) => void;
  options: SelectOption[];
  showError: boolean;
};
function SelectIngredient({
  label,
  value,
  onValueChange,
  options,
  showError,
}: SelectIngredientType) {
  const invalid = showError && !value;
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={label} className="text-base font-semibold">
        {label}
        <span aria-hidden="true" className="-ml-1.5">
          *
        </span>
      </FieldLabel>
      <Select
        id={label}
        name={label}
        value={value}
        required
        onValueChange={onValueChange}
      >
        <SelectTrigger aria-invalid={invalid} className="w-sm">
          <SelectValue placeholder="gör ett val" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem value={option} key={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {invalid && <FieldError>Gör ett val.</FieldError>}
    </Field>
  );
}

type ExtraIngredientsType = {
  options: SelectOption[];
  extra: PartialInventory;
  onCheckedChange: (name: string, checked: boolean) => void;
  showError: boolean
};

function ExtraIngredients({
  options,
  extra,
  onCheckedChange,
  showError,
}: ExtraIngredientsType) {
  const invalid = showError && Object.keys(extra).length < 2;
  let error = null;
  if (invalid) {
    error = (
      <Alert variant={"destructive"} className="text-base font-semibold">
        <AlertCircleIcon />
        <AlertTitle> För få extra ingredienser </AlertTitle>
        <AlertDescription>
          {" "}
          Du måste välja minst två extra ingredienser{" "}
        </AlertDescription>
      </Alert>
    )
  }
  return (
    <div className="mb-3">
      <Label className="text-base font-semibold">Välj extra tillbehör</Label>

      <div className="mt-2 grid grid-cols-4 gap-4">
        {options.map((x) => (
          <div key={x.value} className="flex items-center gap-2">
            <Checkbox
              id={x.value}
              checked={x.value in extra}
              onCheckedChange={(value) => onCheckedChange(x.value, value === true)}
            />
            <Label htmlFor={x.value}>{x.label}</Label>
          </div>
        ))}
      </div>
      {error}
    </div>
  );
}

export default ComposeSalad;
