import { Button } from "./components/ui/button";
import { safeFetchJson } from "./use-fetch-inventory";
import { useNavigate } from "react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import type { Salad } from "./salad";
import { useState } from "react";
import { CircleCheckIcon } from "lucide-react";
import { Outlet, useOutletContext, useParams } from "react-router";
import { Badge } from "./components/ui/badge";
import { Spinner } from "./components/ui/spinner";

type PropsType = { cart: Salad[] };
function ViewCart() {
  const { cart } = useOutletContext<PropsType>();
  const { uuid } = useParams()
  return (
    <>
      <Outlet context={{ cart }} />
      <Card className="w-full p-3">
        {cardHead}
        <CardContent>
          <Table>
            {tableHead}
            <TableBody>
              {cart.map((salad) =>
                <TableRow key={salad.uuid}>
                  <TableCell className="font-normal">
                    {Object.keys(salad.getIngredients()).join(", ")}
                    {salad.uuid === uuid && (
                      <Badge> Ny </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>{salad.info().vegan ? <CircleCheckIcon className="m-auto text-primary"></CircleCheckIcon> : ""}</div>
                  </TableCell>
                  <TableCell>
                    <div>{salad.info().lactose ? <CircleCheckIcon className="m-auto text-primary"></CircleCheckIcon> : ""}</div>
                  </TableCell>
                  <TableCell>
                    <div>{salad.info().gluten ? <CircleCheckIcon className="m-auto text-primary"></CircleCheckIcon> : ""}</div>
                  </TableCell>
                  <TableCell className="text-right font-normal tabular-nums">
                    <div>{salad.price()} kr </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Totalt</TableCell>
                <TableCell className="text-right tabular-nums">
                  {cart.reduce((acc, nbr) =>
                    acc + nbr.price(), 0)} kr
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

type OrderType = string[][];
type OrderResponseType = {
  status: "confirmed" | "canceled";
  timestamp: string;
  uuid: string;
  price: number;
  order: OrderType;
};

type ContextType = { cart: Salad[]; clearCart(): void };

function OrderButton() {
  const navigate = useNavigate();
  const { cart, clearCart } = useOutletContext<ContextType>();
  const [confirmation, setConfirmation] = useState<OrderResponseType | undefined>(undefined);

  async function order() {
    setConfirmation(undefined);

    const body: OrderType = cart.map((salad) =>
      Object.keys(salad.getIngredients())
    );
    const conf = await safeFetchJson<OrderResponseType>(
      "http://localhost:8080/orders",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    clearCart();
    navigate(`/view-cart`);
    setConfirmation(conf);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button onClick={order}>Skicka beställningen</Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Beställning</AlertDialogTitle>
        </AlertDialogHeader>

        {confirmation === undefined ? (
          <Spinner />
        ) : (
          <div>
            <p>Beställningen består av {confirmation.order.length} sallader.</p>
            <p>status: {confirmation.status}</p>
            <p>pris: {confirmation.price} kr</p>
            <p>orderid: {confirmation.uuid}</p>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const tableHead = (
  <TableHeader>
    <TableRow>
      <TableHead className="font-semibold">Ingredienser</TableHead>
      <TableHead className="text-center font-semibold">Vegan</TableHead>
      <TableHead className="text-center font-semibold">Lactose</TableHead>
      <TableHead className="text-center font-semibold">Gluten</TableHead>
      <TableHead className="text-right font-semibold">Pris</TableHead>
    </TableRow>
  </TableHeader>
);

const cardHead = (
  <CardHeader>
    <CardTitle>Varukorgen</CardTitle>
    <CardDescription>Här listas alla sallader du skapat.</CardDescription>
    <CardAction><OrderButton /></CardAction>
  </CardHeader>
);

export default ViewCart;