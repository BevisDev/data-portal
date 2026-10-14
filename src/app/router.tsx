import { App as AntdApp, ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { enterpriseTheme } from "./theme";
import { PortalLayout } from "../layouts/PortalLayout";
import {
  DashboardPage,
  DefinitionsPage,
  LoginPage,
  PermissionsPage,
  ProfilePage,
  RecordsPage,
  RolesPage,
  SendNotificationPage,
  SourcesTargetsPage,
  TemplatesPage,
  UsersPage,
  WebhooksPage,
  WhitePage,
} from "../pages";
import { PermissionGuard } from "../middleware/PermissionGuard";
import { SessionMiddleware } from "../middleware/SessionMiddleware";
import { AppErrorBoundary } from "../middleware/AppErrorBoundary";
import { GlobalErrorMiddleware } from "../middleware/GlobalErrorMiddleware";
import "../services/httpClient";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const ADMIN_ROUTES = [
  { path: "users", element: <UsersPage />, permission: "user:read" },
  { path: "roles", element: <RolesPage />, permission: "role:read" },
  { path: "permissions", element: <PermissionsPage />, permission: "permission:read" },
] as const;

const NOTIFICATION_ROUTES = [
  { path: "definitions", element: <DefinitionsPage />, permission: "notification:read" },
  { path: "templates", element: <TemplatesPage />, permission: "notification:read" },
  { path: "sources-targets", element: <SourcesTargetsPage />, permission: "notification:read" },
  { path: "webhooks", element: <WebhooksPage />, permission: "notification:read" },
  { path: "send", element: <SendNotificationPage />, permission: "notification:manage" },
] as const;

export function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
    <ConfigProvider theme={enterpriseTheme}>
      <AntdApp>
        <AppErrorBoundary>
          <GlobalErrorMiddleware />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route element={<SessionMiddleware />}>
                <Route element={<PortalLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route
                    path="/records"
                    element={
                      <PermissionGuard permission="data:read">
                        <RecordsPage />
                      </PermissionGuard>
                    }
                  />
                  <Route path="/admin">
                    <Route index element={<Navigate to="users" replace />} />
                    {ADMIN_ROUTES.map(({ path, element, permission }) => (
                      <Route
                        key={path}
                        path={path}
                        element={<PermissionGuard permission={permission}>{element}</PermissionGuard>}
                      />
                    ))}
                  </Route>
                  {/* Old flat paths, kept so bookmarks still work. */}
                  {ADMIN_ROUTES.map(({ path }) => (
                    <Route key={`legacy-${path}`} path={`/${path}`} element={<Navigate to={`/admin/${path}`} replace />} />
                  ))}
                  <Route path="/notification">
                    <Route index element={<Navigate to="definitions" replace />} />
                    {NOTIFICATION_ROUTES.map(({ path, element, permission }) => (
                      <Route
                        key={path}
                        path={path}
                        element={<PermissionGuard permission={permission}>{element}</PermissionGuard>}
                      />
                    ))}
                  </Route>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/white" element={<WhitePage />} />
                  <Route path="/business/*" element={<WhitePage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AppErrorBoundary>
      </AntdApp>
    </ConfigProvider>
    </QueryClientProvider>
  );
}
