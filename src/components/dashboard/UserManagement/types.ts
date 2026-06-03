export type AdminRole = "Super Admin" | "Operations" | "Sales" | "Support";
export type AdminState = "Active" | "Inactive";

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  lastLogin: string;
  state: AdminState;
}
