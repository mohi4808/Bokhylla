import type { BookInfo } from "./types";

export function parseSearch(json: any): BookInfo[] {
  return json.docs.map((doc: any) => ({
    id: doc.key.split("/").pop(),
    title: doc.title,
    author: doc.author_name?.join(", "),
    year: doc.first_publish_year,
    coverId: doc.cover_i,
  }));
}