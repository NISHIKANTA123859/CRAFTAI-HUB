import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { CraftVision } from "./pages/CraftVision";
import { CraftGen } from "./pages/CraftGen";
import { CraftMarket } from "./pages/CraftMarket";
import { CraftAuth } from "./pages/CraftAuth";
import { CraftVerse } from "./pages/CraftVerse";
import { History } from "./pages/History";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "recognition", Component: CraftVision },
      { path: "history", Component: History },
      { path: "craft-gen", Component: CraftGen },
      { path: "marketplace", Component: CraftMarket },
      { path: "craft-auth", Component: CraftAuth },
      { path: "museum", Component: CraftVerse },
      { path: "*", Component: NotFound },
    ],
  },
]);