  import { useState } from "react";
  import { Salad } from "@/salad";

  import { Link } from "react-router";
  import { Outlet } from "react-router";
import { useFetchInventory } from "./use-fetch-inventory";

  function readCart(): Salad[] {
    const currentCart = window.localStorage.getItem("cart");
    if (currentCart === null) {
      return [];
    } else {
      return Salad.parse(currentCart);
    }
  }

  function App() {
    const [cart, setCart] = useState<Salad[]>(readCart);
    const inventory = useFetchInventory('http://localhost:8080');

    function addSalad(salad: Salad) {
      const newCart = [...cart, salad];
      setCart(newCart);
      window.localStorage.setItem("cart", JSON.stringify(newCart));
    }

    function clearCart() {
      const clearedCart: Salad[] = [];
      setCart(clearedCart);
      window.localStorage.setItem("cart", JSON.stringify(clearedCart));

    }
    return (
      <div className="grid max-w-4xl grid-rows-1 gap-4">
        <h1 className="text-center text-3xl font-bold md:w-4xl">Min egen salladsbar</h1>

        <nav className="flex gap-4">
          <Link to="/">Hem</Link>
          <Link to="/compose-salad">Skapa sallad</Link>
          <Link to="/view-cart">Varukorgen</Link>
        </nav>
        <Outlet context={{ inventory, cart, addSalad, clearCart }} />
        
      </div>
    );
  }



  export default App;
