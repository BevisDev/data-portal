import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { isSessionExpired } from "../utils/platform";

export function SessionMiddleware() {
  const location = useLocation();
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    if (!session) {
      return undefined;
    }

    const checkSession = () => {
      if (isSessionExpired(session.expiresAt)) {
        clearSession();
      }
    };

    checkSession();
    const timer = window.setInterval(checkSession, 10_000);
    return () => window.clearInterval(timer);
  }, [session, clearSession]);

  if (!session) {
    return <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />;
  }

  if (isSessionExpired(session.expiresAt)) {
    clearSession();
    return <Navigate to="/login" replace state={{ reason: "expired" }} />;
  }

  return <Outlet />;
}
