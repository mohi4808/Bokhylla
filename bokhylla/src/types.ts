export interface BookInfo {
  id: string;
  title: string;
  author?: string;
  year?: number;
  coverId?: number;
  rating?: number;
  note?: string;
}

export type ReadingListMap = Record<string, BookInfo>;

export interface AppContext {
  readingList: ReadingListMap;
  addBook: (book: BookInfo) => void;
  removeBook: (id: string) => void;
  saveReview: (id: string, rating: number | undefined, note: string) => void;
  clearList: () => void;
}