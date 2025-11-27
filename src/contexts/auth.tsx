import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "../stores/auth";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) return null;

  return user ? children : <Navigate to="/login" replace />;
}
