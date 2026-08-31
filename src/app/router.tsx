import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { enterpriseTheme } from "./theme";
import { PortalLayout } from "../layouts/PortalLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { PermissionsPage } from "../pages/PermissionsPage";
import { ProfilePage } from "../pages/ProfilePage";
import { RecordsPage } from "../pages/RecordsPage";
import { RolesPage } from "../pages/RolesPage";
import { UsersPage } from "../pages/UsersPage";
import { WhitePage } from "../pages/WhitePage";
import { PermissionGuard } from "../middleware/PermissionGuard";
import { SessionMiddleware } from "../middleware/SessionMiddleware";
import { AppErrorBoundary } from "../middleware/AppErrorBoundary";
import { GlobalErrorMiddleware } from "../middleware/GlobalErrorMiddleware";
import "../services/httpClient";

export function AppRouter() {
  return (
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
                  <Route
                    path="/users"
                    element={
                      <PermissionGuard permission="user:read">
                        <UsersPage />
                      </PermissionGuard>
                    }
                  />
                  <Route
                    path="/roles"
                    element={
                      <PermissionGuard permission="role:read">
                        <RolesPage />
                      </PermissionGuard>
                    }
                  />
                  <Route
                    path="/permissions"
                    element={
                      <PermissionGuard permission="permission:read">
                        <PermissionsPage />
                      </PermissionGuard>
                    }
                  />
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
  );
}
