import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Wrong role: redirect to their correct dashboard
    return <Navigate to={user.role === "seller" ? "/marketplace" : "/home"} replace />;
  }

  return <>{children}</>;
}
