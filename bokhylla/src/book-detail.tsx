import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getBook, getBookFacts } from "./open-library";

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [facts, setFacts] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    setBook(null);
    setFacts(null);
    setError("");

    Promise.all([getBook(id), getBookFacts(id)])
      .then(([bookData, factsData]) => {
        if (ignore) return;
        setBook(bookData);
        setFacts(factsData);
      })
      .catch((err) => {
        if (ignore) return;
        setError(
          err.message === "not-found"
            ? "Boken kunde inte hittas."
            : "Något gick fel när boken skulle hämtas."
        );
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (error) {
    return (
      <p>
        {error} <Link to="/" className="underline">Tillbaka till sökning</Link>
      </p>
    );
  }
  if (!book) return <p>Laddar...</p>;

  const description =
    typeof book.description === "string"
      ? book.description
      : book.description?.value;

  return (
    <div className="flex gap-4">
      {book.covers?.[0] && (
        <img
          src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`}
          alt={book.title}
          className="h-64"
        />
      )}
      <div className="grid gap-2">
        <h2 className="text-2xl font-bold">{book.title}</h2>
        {facts?.author_name && <p>Av {facts.author_name.join(", ")}</p>}

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          {facts?.first_publish_year && (
            <>
              <dt className="font-semibold">Först utgiven</dt>
              <dd>{facts.first_publish_year}</dd>
            </>
          )}
          {facts?.publisher && (
            <>
              <dt className="font-semibold">Förlag</dt>
              <dd>{facts.publisher.slice(0, 5).join(", ")}</dd>
            </>
          )}
          {facts?.number_of_pages_median && (
            <>
              <dt className="font-semibold">Sidor</dt>
              <dd>{facts.number_of_pages_median}</dd>
            </>
          )}
          {facts?.language && (
            <>
              <dt className="font-semibold">Språk</dt>
              <dd>{facts.language.join(", ")}</dd>
            </>
          )}
          {facts?.edition_count && (
            <>
              <dt className="font-semibold">Utgåvor</dt>
              <dd>{facts.edition_count}</dd>
            </>
          )}
        </dl>

        {description && <p>{description}</p>}
        {book.subjects && <p>Ämnen: {book.subjects.slice(0, 10).join(", ")}</p>}
      </div>
    </div>
  );
}