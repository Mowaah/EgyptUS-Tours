export interface AdminRoleAction {
  key: string;
  label: string;
}

export interface AdminRoleModule {
  key: string;
  label: string;
  actions: AdminRoleAction[];
}

export interface AdminRolePermissions {
  [moduleKey: string]: {
    [actionKey: string]: boolean;
  };
}

export interface AdminRole {
  id: number;
  name: string;
  slug: string;
  is_system: boolean;
  is_super_admin: boolean;
  permissions: AdminRolePermissions;
  users_count: number;
}
