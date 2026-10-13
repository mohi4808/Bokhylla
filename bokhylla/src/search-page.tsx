import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { searchBooks } from "./open-library";
import { parseSearch } from "./book";
import type { BookInfo } from "./types";
import { Spinner } from "@/components/ui/spinner";
import BookCard from "./book-card";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") ?? "";

  const [text, setText] = useState(query);
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setBooks([]);
      return;
    }
    let ignore = false;
    setLoading(true);
    setError("");
    setBooks([])

    searchBooks(query)
      .then((data) => {
        if (!ignore) setBooks(parseSearch(data));
      })
      .catch(() => {
        if (!ignore) setError("Sökningen misslyckades. Försök igen.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="grid gap-4">
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

      {loading && (
        <div className="flex items-center gap-2">
          <Spinner />
          <span className="text-sm">Söker...</span>
        </div>
      )}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && query && books.length === 0 && (
        <p>Inga böcker hittades för "{query}".</p>
      )}

      <div className="grid gap-3">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}