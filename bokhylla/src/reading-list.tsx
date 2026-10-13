import { Link, useOutletContext } from "react-router";
import type { AppContext, BookInfo } from "./types";
import React, { useState } from "react";

function ReviewForm({ book }: { book: BookInfo }) {
  const { saveReview } = useOutletContext<AppContext>();
  const [rating, setRating] = useState(book.rating?.toString() ?? "");
  const [note, setNote] = useState(book.note ?? "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);

    if (rating === "") {
      saveReview(book.id, undefined, note);
      setError("");
      setSaved(true);
      return;
    }

    const value = Number(rating);
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      setError("Betyget måste vara ett heltal mellan 1 och 5");
      return;
    }

    setError("");
    saveReview(book.id, value, note);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-2">
      <label htmlFor={`rating-${book.id}`} className="text-sm font-medium">
        Betyg (1-5)
      </label>
      <input
        id={`rating-${book.id}`}
        type="number"
        value={rating}
        onChange={(e) => {
          setRating(e.target.value);
          setSaved(false);
        }}
        aria-invalid={error !== ""}
        className="w-20 rounded border bg-transparent px-2 py-1"
      />
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      <label htmlFor={`note-${book.id}`} className="text-sm font-medium">
        Anteckning
      </label>
      <textarea
        id={`note-${book.id}`}
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          setSaved(false);
        }}
        rows={3}
        className="rounded border bg-transparent px-2 py-1"
      />

      <div className="flex items-center gap-3">
        <button type="submit" className="rounded border px-3 py-1">
          Spara
        </button>
        {saved && <p className="text-sm text-green-500">Sparat!</p>}
      </div>
    </form>
  );
}

export default function ReadingList() {
  const { readingList, removeBook, clearList } = useOutletContext<AppContext>();
  const books = Object.values(readingList);

  if (books.length === 0) {
    return (
      <p>
        Din läslista är tom.{" "}
        <Link to="/" className="underline">
          Sök efter böcker
        </Link>{" "}
        för att lägga till några.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm">{books.length} böcker i listan</p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Vill du ta bort alla böcker från läslistan?")) {
              clearList();
            }
          }}
          className="rounded border px-3 py-1 text-sm"
        >
          Rensa listan
        </button>
      </div>

      {books.map((book) => (
        <div
          key={book.id}
          className="grid gap-4 rounded-lg border p-4 md:grid-cols-[auto_1fr_1.5fr]"
        >
          {book.coverId ? (
            <img
              src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
              alt={book.title}
              className="h-44 w-28 rounded object-cover"
            />
          ) : (
            <div className="flex h-44 w-28 items-center justify-center rounded border text-center text-xs text-muted-foreground">
              Inget omslag
            </div>
          )}

          <div className="flex flex-col justify-between gap-2">
            <div>
              <Link
                to={`/book/${book.id}`}
                className="text-lg font-semibold underline"
              >
                {book.title}
              </Link>
              {book.author && <p className="text-sm">{book.author}</p>}
              {book.year && <p className="text-sm">{book.year}</p>}
            </div>
            <button
              type="button"
              onClick={() => removeBook(book.id)}
              className="self-start rounded border px-3 py-1 text-sm"
            >
              Ta bort
            </button>
          </div>

          <ReviewForm book={book} />
        </div>
      ))}
    </div>
  );
}