import type { BookInfo } from "./types";

interface SearchDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

export function parseSearch(json: { docs: SearchDoc[] }): BookInfo[] {
  return json.docs.map((doc) => ({
    id: doc.key.split("/").pop() ?? doc.key,
    title: doc.title,
    author: doc.author_name?.join(", "),
    year: doc.first_publish_year,
    coverId: doc.cover_i,
  }));
}