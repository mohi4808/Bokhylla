export async function searchBooks(query: string) {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
  );
  if (!response.ok) throw new Error("fetch-failed");
  return response.json();
}

export async function getBook(id: string) {
  const response = await fetch(`https://openlibrary.org/works/${id}.json`);
  if (!response.ok) {
    throw new Error(response.status === 404 ? "not-found" : "fetch-failed");
  }
  return response.json();
}

export async function getBookFacts(id: string) {
  const fields =
    "title,author_name,first_publish_year,publisher,number_of_pages_median,language,edition_count,subject";
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(`key:/works/${id}`)}&fields=${fields}`
  );
  if (!response.ok) return null;
  const data = await response.json();
  return data.docs?.[0] ?? null;
}