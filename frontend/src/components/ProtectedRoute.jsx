import { Navigate } from "react-router-dom";
import { useAuth, dashboardPath } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

function AuthLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}

export function ProtectedRoute({ children, roles }) {
  const { user, role, loading } = useAuth();

  if (loading) return <AuthLoading />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles?.length && (!role || !roles.includes(role))) {
    return <Navigate to={dashboardPath(role)} replace />;
  }
  return children;
}

export function GuestRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) return <AuthLoading />;
  if (user) return <Navigate to={dashboardPath(role)} replace />;
  return children;
}
