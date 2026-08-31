import { create } from "zustand";
import { INITIAL_RECORDS, INITIAL_ROLES, INITIAL_USERS } from "../data/mockData";
import type { DataRecord, RoleRecord, UserRecord } from "../types/platform";
import { createId, todayIso } from "../utils/platform";

type PlatformState = {
  users: UserRecord[];
  roles: RoleRecord[];
  records: DataRecord[];
  addRecord: (payload: Omit<DataRecord, "id" | "updatedAt">) => void;
  updateRecord: (id: string, payload: Omit<DataRecord, "id" | "updatedAt">) => void;
  deleteRecord: (id: string) => void;
  addUser: (payload: Omit<UserRecord, "id">) => void;
  updateUser: (id: string, payload: Omit<UserRecord, "id">) => void;
  deleteUser: (id: string) => void;
  addRole: (payload: Omit<RoleRecord, "id">) => void;
  updateRole: (id: string, payload: Omit<RoleRecord, "id">) => void;
  deleteRole: (id: string) => void;
};

export const usePlatformStore = create<PlatformState>((set) => ({
  users: INITIAL_USERS,
  roles: INITIAL_ROLES,
  records: INITIAL_RECORDS,
  addRecord: (payload) =>
    set((state) => ({
      records: [...state.records, { ...payload, id: createId(), updatedAt: todayIso() }],
    })),
  updateRecord: (id, payload) =>
    set((state) => ({
      records: state.records.map((record) =>
        record.id === id ? { ...record, ...payload, updatedAt: todayIso() } : record,
      ),
    })),
  deleteRecord: (id) => set((state) => ({ records: state.records.filter((record) => record.id !== id) })),
  addUser: (payload) => set((state) => ({ users: [...state.users, { id: createId(), ...payload }] })),
  updateUser: (id, payload) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? { id: user.id, ...payload } : user)),
    })),
  deleteUser: (id) => set((state) => ({ users: state.users.filter((user) => user.id !== id) })),
  addRole: (payload) => set((state) => ({ roles: [...state.roles, { id: createId(), ...payload }] })),
  updateRole: (id, payload) =>
    set((state) => ({
      roles: state.roles.map((role) => (role.id === id ? { id: role.id, ...payload } : role)),
    })),
  deleteRole: (id) => set((state) => ({ roles: state.roles.filter((role) => role.id !== id) })),
}));
