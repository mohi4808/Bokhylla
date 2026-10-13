import { Link, useOutletContext } from "react-router";
import type { AppContext } from "./types";


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


