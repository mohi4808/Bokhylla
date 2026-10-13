import { Link, useOutletContext } from "react-router";
import type { AppContext, BookInfo } from "./types";
import React, { useState } from "react";
import BookDetail from "./book-detail";


function ReviewForm({ book }: { book: BookInfo}){
  const { saveReview } = useOutletContext<AppContext>();
  const [rating, setRating] = useState(book.rating?.toString() ?? "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    setSaved(false);

    if (rating === ""){
      saveReview(book.id, undefined);
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
    saveReview(book.id, value);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-2">
      <label htmlFor={`rating-${book.id}`}>Betyg (1-5)</label>
      <input
        id={`rating-${book.id}`}
        type="number"
        value={rating}
        onChange={(e) => {
          setRating(e.target.value);
          setSaved(false);
        }}
        aria-invalid={error !== ""}
        className="w-20 border px-2 py-1"
        />
        {error && <p role="alert">{error}</p>}

        <button type="submit" className="self-start border px-3 py-1">
          Spara
        </button>
        {saved && <p>Sparat!</p>}
    </form>
  );
}

export default function ReadingList() {
  const {readingList, removeBook} = useOutletContext<AppContext>();
  const books = Object.values(readingList);

  console.log(readingList);
  
  if (books.length === 0){
    return (
      <p>
        Din läslista är tom. <Link to="/">Sök efter böcker</Link> för att lägga till några.
      </p>
    );
  }

  return (
    <table className="w-full text-left">
      <thead>
        <tr>
          <th>Titel</th>
          <th>Författare</th>
          <th>År</th>
          <th>Betyg</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {books.map((book) =>(
          <tr key={book.id}>
            <td>
              <Link to={`/book/${book.id}`}>{book.title}</Link>
            </td>
            <td>{book.author}</td>
            <td>{book.year}</td>
            <td>
              <ReviewForm book={book}></ReviewForm>
            </td>
            <td>
              <button
              type="button"
              onClick={() => removeBook(book.id)}
              className="border px-3 py-1">
                Ta bort
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

  )
}


