"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { verifyToken, isAuthenticated } from "@/lib/api/auth";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      // If on login page, redirect to admin if already authenticated
      if (pathname === '/login') {
        const authenticated = isAuthenticated();
        if (authenticated) {
          const isValid = await verifyToken();
          if (isValid) {
            router.push('/admin');
            return;
          }
        }
        setIsChecking(false);
        return;
      }

      // For admin routes, verify authentication
      if (pathname?.startsWith('/admin') || pathname === '/') {
        const authenticated = isAuthenticated();
        if (!authenticated) {
          router.push('/login');
          setIsChecking(false);
          return;
        }

        // Verify token with backend
        const isValid = await verifyToken();
        if (!isValid) {
          router.push('/login');
          setIsChecking(false);
          return;
        }

        setIsAuthorized(true);
      } else {
        setIsAuthorized(true);
      }

      setIsChecking(false);
    }

    checkAuth();
  }, [pathname, router]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authorized (will redirect)
  if (pathname?.startsWith('/admin') || pathname === '/') {
    if (!isAuthorized) {
      return null;
    }
  }

  return <>{children}</>;
}

