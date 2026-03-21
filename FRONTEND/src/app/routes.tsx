import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { CraftVision } from "./pages/CraftVision";
import { CraftGen } from "./pages/CraftGen";
import { CraftMarket } from "./pages/CraftMarket";
import { CraftAuth } from "./pages/CraftAuth";
import { CraftVerse } from "./pages/CraftVerse";
import { History } from "./pages/History";

export const router = createBrowserRouter([
  // Public: Login page (fullscreen, no layout shell)
  { path: "/", element: <Login /> },

  // Protected: Main app shell
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      // Buyer-only routes
      { path: "home", element: <ProtectedRoute allowedRoles={["buyer"]}><Home /></ProtectedRoute> },
      { path: "recognition", element: <ProtectedRoute allowedRoles={["buyer"]}><CraftVision /></ProtectedRoute> },
      { path: "craft-gen", element: <ProtectedRoute allowedRoles={["buyer"]}><CraftGen /></ProtectedRoute> },
      { path: "craft-auth", element: <ProtectedRoute allowedRoles={["buyer"]}><CraftAuth /></ProtectedRoute> },
      { path: "museum", element: <ProtectedRoute allowedRoles={["buyer"]}><CraftVerse /></ProtectedRoute> },
      { path: "history", element: <ProtectedRoute allowedRoles={["buyer"]}><History /></ProtectedRoute> },

      // Shared marketplace (both buyer and seller)
      { path: "marketplace", element: <ProtectedRoute allowedRoles={["buyer", "seller"]}><CraftMarket /></ProtectedRoute> },
    ],
  },
]);