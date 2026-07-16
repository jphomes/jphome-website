import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function ProtectedRoute({ children }) {
  const { admin, token, loading } = useAuth();

  if (loading || (token && !admin)) {
    return <div className="admin-loading">Preparing studio…</div>;
  }

  if (!admin) return <Navigate to="/admin/login" replace />;

  return children;
}
