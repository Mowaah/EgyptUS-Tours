export interface AdminRoleRow {
  id: number;
  name: string;
  slug: string;
}

export interface AdminUserRow {
  id: number;
  display_id: string;
  full_name: string;
  email: string;
  role: string;
  role_label: string;
  role_id: number;
  profile_picture: string | null;
  last_login: string | null;
  is_active: boolean;
  date_joined: string;
}
