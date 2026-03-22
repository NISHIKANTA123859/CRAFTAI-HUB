import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
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
  // Public: 3D Login Authentication Portal
  { path: "/", element: <Login /> },

  // Protected application routes
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "home", element: <ProtectedRoute allowedRoles={["buyer"]}><Home /></ProtectedRoute> },
      { path: "recognition", element: <ProtectedRoute allowedRoles={["buyer"]}><CraftVision /></ProtectedRoute> },
      { path: "craft-gen", element: <ProtectedRoute allowedRoles={["buyer"]}><CraftGen /></ProtectedRoute> },
      { path: "craft-auth", element: <ProtectedRoute allowedRoles={["buyer"]}><CraftAuth /></ProtectedRoute> },
      { path: "museum", element: <ProtectedRoute allowedRoles={["buyer"]}><CraftVerse /></ProtectedRoute> },
      { path: "history", element: <ProtectedRoute allowedRoles={["buyer"]}><History /></ProtectedRoute> },
      { path: "track-order", element: <ProtectedRoute allowedRoles={["buyer"]}><TrackOrder /></ProtectedRoute> },
      
      { 
        path: "marketplace",
        children: [
          { index: true, element: <ProtectedRoute allowedRoles={["buyer", "seller"]}><CraftMarket /></ProtectedRoute> },
          { path: "checkout", element: <ProtectedRoute allowedRoles={["buyer", "seller"]}><Checkout /></ProtectedRoute> },
        ]
      },
      
      { path: "admin", element: <AdminDashboard /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);