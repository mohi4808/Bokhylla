import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router";
import type { BookInfo, ReadingListMap } from "./types";

const STORAGE_KEY = "bokhyllan-readinglist";

function loadReadingList(): ReadingListMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function App() {
  const [readingList, setReadingList] = useState<ReadingListMap>(loadReadingList);


  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readingList));
    } catch {
    }
  }, [readingList]);

  function addBook(book: BookInfo) {
    setReadingList({ ...readingList, [book.id]: book, });
  }

  function removeBook(id: string) {
    const { [id]: _removed, ...rest } = readingList;
    setReadingList(rest);
  }

  function saveReview(id: string, rating: number | undefined, note: string) {
    const book = readingList[id];
    if (!book) return;
    setReadingList({ ...readingList, [id]: { ...book, rating, note } },);
  }

  return (
    <div className="grid max-w-4xl grid-rows-1 gap-4">
      <h1 className="text-center text-3xl font-bold md:w-4xl">Bokhyllan</h1>

      <nav className="flex gap-4">
        <Link to="/">Sök</Link>
        <Link to="/list">Min läslista ({Object.keys(readingList).length})</Link>
      </nav>

      <Outlet context={{ readingList, addBook, removeBook, saveReview }} />
    </div>
  );
}

export default App;