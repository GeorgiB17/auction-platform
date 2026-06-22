import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string;
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Allow access for specific users regardless of their role
  if (user.username === "aj049" || user.username === "gb040") {
    return <>{children}</>;
  }

  if (roles && roles !== user.role) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        You do not have permission to access this page.
      </div>
    );
  }

  return <>{children}</>;
}