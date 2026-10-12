import { useEffect } from "react";
import { searchBooks } from "./open-library";
import { parseSearch } from "./book";

export default function SearchPage() {
  useEffect(() => {
    searchBooks("Harry Potter").then((data) => console.log(parseSearch(data)));
  }, []);

  return <p>Sök</p>;
}