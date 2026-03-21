import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { CraftVision } from "./pages/CraftVision";
import { CraftGen } from "./pages/CraftGen";
import { CraftMarket } from "./pages/CraftMarket";
import { Checkout } from "./pages/Checkout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { CraftAuth } from "./pages/CraftAuth";
import { CraftVerse } from "./pages/CraftVerse";
import { History } from "./pages/History";
import { TrackOrder } from "./pages/TrackOrder";
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
      { path: "track-order", Component: TrackOrder },
      { 
        path: "marketplace",
        children: [
          { index: true, Component: CraftMarket },
          { path: "checkout", Component: Checkout },
        ]
      },
      { path: "admin", Component: AdminDashboard },
      { path: "craft-auth", Component: CraftAuth },
      { path: "museum", Component: CraftVerse },
      { path: "*", Component: NotFound },
    ],
  },
]);