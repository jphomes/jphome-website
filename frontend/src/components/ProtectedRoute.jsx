import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal text-stone font-mono text-sm tracking-widest2">
        LOADING…
      </div>
    );
  }

  if (!admin) return <Navigate to="/admin/login" replace />;

  return children;
}
