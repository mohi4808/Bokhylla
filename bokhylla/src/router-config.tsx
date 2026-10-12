import { createBrowserRouter, useOutletContext, useParams, type RouteObject } from "react-router";
import App from "./App";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import ViewCart from "./view-cart";
import ComposeSalad from "./compose-salad";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import type { Salad } from "./salad";
import { CircleCheck } from "lucide-react";

const routerConfig: RouteObject[] = [
  {
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "view-cart",
        Component: ViewCart,
        children: [
          {
            path: "new/:uuid",
            Component: NewSaladInfoBox
          }
        ]
      },
      {
        path: "compose-salad",
        Component: ComposeSalad
      },
      {
        path: "*",
        Component: PageNotFound
      }
    ],
  },
];

function Home() {
  return (
    <Card className="md:w-3xl">
      <CardHeader>
        <CardTitle>Välkommen till min salladsbar</CardTitle>
        <CardDescription>
          Här kan du komponera och beställa sallader.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function PageNotFound() {
  return <h2>Sidan kunde inte hittas</h2>;
}

function NewSaladInfoBox() {
  const { uuid } = useParams();
  const { cart } = useOutletContext<{ cart: Salad[] }>();

  const salad = cart.find((salad) => salad.uuid === uuid);

  if (!salad) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Felaktig url.</AlertTitle>
        <AlertDescription>Det finns ingen sallad med uuid {uuid} i varukorgen.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <CircleCheck></CircleCheck>
      <AlertTitle>En ny sallad har lagts till i varukorgen:</AlertTitle>
      <AlertDescription> 
        {Object.keys(salad.getIngredients()).join(", ")}
        , Den kostar: {salad.price()} kr
      </AlertDescription>
    </Alert>
  );
}

const router = createBrowserRouter(routerConfig);

export default router;