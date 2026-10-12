import { createBrowserRouter, type RouteObject } from "react-router";
import App from "./App";
import SearchPage from "./search-page";
import ReadingList from "./reading-list";
import BookDetail from "./book-detail";

const routerConfig: RouteObject[] = [
  {
    Component: App,
    children: [
      { index: true, Component: SearchPage },
      { path: "search", Component: SearchPage },
      { path: "list", Component: ReadingList },
      { path: "book/:id", Component: BookDetail },
      { path: "*", Component: PageNotFound },
    ],
  },
];

function PageNotFound() {
  return <h2>Sidan kunde inte hittas</h2>;
}

const router = createBrowserRouter(routerConfig);
export default router;

