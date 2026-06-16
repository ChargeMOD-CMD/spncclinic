import { createContext, useContext } from "react";
import { type UserPermissions, ADMIN_PERMISSIONS } from "./admin.shared";

export type AdminContextValue = {
  role: "admin" | "staff" | null;
  permissions: UserPermissions;
  isAdmin: boolean;
};

export const AdminContext = createContext<AdminContextValue>({
  role: null,
  permissions: ADMIN_PERMISSIONS,
  isAdmin: true,
});

export function useAdminContext() {
  return useContext(AdminContext);
}
