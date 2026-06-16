import { z } from "zod";

export const permissionsSchema = z.object({
  can_edit: z.boolean(),
  can_change_status: z.boolean(),
  can_delete: z.boolean(),
  can_create: z.boolean(),
});

export type UserPermissions = z.infer<typeof permissionsSchema>;

export const DEFAULT_STAFF_PERMISSIONS: UserPermissions = {
  can_edit: true,
  can_change_status: true,
  can_delete: false,
  can_create: false,
};

export const ADMIN_PERMISSIONS: UserPermissions = {
  can_edit: true,
  can_change_status: true,
  can_delete: true,
  can_create: true,
};
