import React, { useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth.js";

/** Validates persisted token against /auth/me on app start. */
export function AuthBootstrap({ children }) {
  const { token, bootstrap } = useAuth();
  const booted = useRef(false);

  useEffect(() => {
    if (!token || booted.current) return;
    booted.current = true;
    bootstrap();
  }, [token, bootstrap]);

  return children;
}
