import type { AppContext, BookInfo } from "./types";
import { useOutletContext } from "react-router";



export default function BookCard({ book }: { book: BookInfo }) {
    
    const { readingList, addBook, removeBook } = useOutletContext<AppContext>();
    const inList = book.id in readingList;

  return (
    <div className="flex gap-3 border p-3">
      {book.coverId && (
        <img
          src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
          alt={book.title}
          className="h-32"
        />
      )}
      <div className="flex flex-1 flex-col justify-between">
        <div>
            <p className="font-semibold">{book.title}</p>
            <p>{book.author}</p>
            <p>{book.year}</p>
        </div>
        <button
        type="button"
        onClick={() => (inList ? removeBook(book.id): addBook(book))}
        className="self-end border px-3 py-1"
        >
            {inList ? "Ta bort från läslistan" : "Lägg till i läslistan"}
        </button>
      </div>
    </div>
  );
}