import type { BookInfo } from "./types";

export default function BookCard({ book }: { book: BookInfo }) {
  return (
    <div className="flex gap-3 border p-3">
      {book.coverId && (
        <img
          src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
          alt={book.title}
          className="h-32"
        />
      )}
      <div>
        <p className="font-semibold">{book.title}</p>
        <p>{book.author}</p>
        <p>{book.year}</p>
      </div>
    </div>
  );
}