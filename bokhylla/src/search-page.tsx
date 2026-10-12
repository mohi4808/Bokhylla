import { useEffect, useState } from "react";
import { searchBooks } from "./open-library";
import { parseSearch } from "./book";
import type { BookInfo } from "./types";
import BookCard from "./book-card";


export default function SearchPage() {
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");


  useEffect(() => {
    if (!query) return;
    searchBooks(query).then((data) => setBooks(parseSearch(data)));
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(text);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border px-2 py-1"
        />
        <button type="submit" className="border px-3 py-1">
          Sök
        </button>
      </form>
      <div className="grid gap-3">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}