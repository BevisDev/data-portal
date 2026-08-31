import type { DataRecord, RoleRecord, UserRecord } from "../types/platform";
import { ALL_PERMISSIONS } from "../types/platform";

export const INITIAL_ROLES: RoleRecord[] = [
  {
    id: "role_super_admin",
    name: "Super Admin",
    description: "Owns enterprise-wide configuration and governance.",
    permissions: [...ALL_PERMISSIONS],
  },
  {
    id: "role_data_manager",
    name: "Data Manager",
    description: "Maintains data assets and quality workflows.",
    permissions: ["data:read", "data:write", "data:delete", "user:read", "role:read", "permission:read"],
  },
  {
    id: "role_iam_admin",
    name: "IAM Admin",
    description: "Operates access, users, and role lifecycle.",
    permissions: ["data:read", "user:read", "user:manage", "role:read", "role:manage", "permission:read"],
  },
  {
    id: "role_viewer",
    name: "Viewer",
    description: "Reads approved resources only.",
    permissions: ["data:read", "user:read", "role:read", "permission:read"],
  },
];

export const INITIAL_USERS: UserRecord[] = [
  {
    id: "usr_owner",
    name: "Portal Owner",
    email: "owner@platform.local",
    provider: "local",
    password: "admin123",
    roleIds: ["role_super_admin"],
    status: "active",
    title: "Chief Data Officer",
  },
  {
    id: "usr_data",
    name: "Data Operations",
    email: "data.manager@platform.local",
    provider: "google",
    roleIds: ["role_data_manager"],
    status: "active",
    title: "Data Platform Manager",
  },
  {
    id: "usr_iam",
    name: "Access Security",
    email: "iam.admin@platform.local",
    provider: "github",
    roleIds: ["role_iam_admin"],
    status: "active",
    title: "IAM Administrator",
  },
  {
    id: "usr_viewer",
    name: "Business Viewer",
    email: "viewer@platform.local",
    provider: "local",
    password: "viewer123",
    roleIds: ["role_viewer"],
    status: "active",
    title: "Business Analyst",
  },
];

export const INITIAL_RECORDS: DataRecord[] = [
  {
    id: "rec_1",
    name: "Sales Daily Snapshot",
    category: "Sales",
    owner: "Data Operations",
    status: "active",
    updatedAt: "2026-08-24",
  },
  {
    id: "rec_2",
    name: "Support Health Metrics",
    category: "Support",
    owner: "Access Security",
    status: "active",
    updatedAt: "2026-08-26",
  },
  {
    id: "rec_3",
    name: "Finance Monthly Rollup",
    category: "Finance",
    owner: "Portal Owner",
    status: "draft",
    updatedAt: "2026-08-28",
  },
  {
    id: "rec_4",
    name: "Churn Prediction Inputs",
    category: "Machine Learning",
    owner: "Data Operations",
    status: "active",
    updatedAt: "2026-08-29",
  },
  {
    id: "rec_5",
    name: "Legacy Billing Report",
    category: "Billing",
    owner: "Business Viewer",
    status: "archived",
    updatedAt: "2026-08-22",
  },
];
