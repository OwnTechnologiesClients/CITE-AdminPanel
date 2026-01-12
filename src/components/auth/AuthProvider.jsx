"use client";

import AuthGuard from "./AuthGuard";

export default function AuthProvider({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}

