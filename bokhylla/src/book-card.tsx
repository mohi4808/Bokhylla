import type { AppContext, BookInfo } from "./types";
import { Link, useOutletContext } from "react-router";



export default function BookCard({ book }: { book: BookInfo }) {

  const { readingList, addBook, removeBook } = useOutletContext<AppContext>();
  const inList = book.id in readingList;

  return (
    <div className="flex gap-3 border p-3">
      {book.coverId && (
        <img
          src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
          alt={book.title}
          loading="lazy"
          className="h-32"
        />
      )}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link to={`/book/${book.id}`} className="font-semibold underline">
            {book.title}
          </Link>
          {book.author && <p>{book.author}</p>}
          {book.year && <p>{book.year}</p>}
        </div>
        <button
          type="button"
          onClick={() => (inList ? removeBook(book.id) : addBook(book))}
          className="self-end border px-3 py-1"
        >
          {inList ? "Ta bort från läslistan" : "Lägg till i läslistan"}
        </button>
      </div>
    </div>
  );
}