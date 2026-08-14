import { AdminUsersPanel } from "./AdminUsersPanel";
import type { AdminUserRow, AdminRoleRow } from "./types";
import styles from "./UserManagement.module.scss";

interface UserManagementProps {
  users: AdminUserRow[];
  roles: AdminRoleRow[];
  searchQuery?: string;
  onEditUser?: (user: AdminUserRow) => void;
  onToggleUserStatus?: (user: AdminUserRow) => void;
  onDeleteUser?: (user: AdminUserRow) => void;
}

export default function UserManagement({
  users,
  roles,
  searchQuery,
  onEditUser,
  onToggleUserStatus,
  onDeleteUser,
}: UserManagementProps) {
  return (
    <div className={styles.page}>
      <AdminUsersPanel
        users={users}
        roles={roles}
        searchQuery={searchQuery}
        onEditUser={onEditUser}
        onToggleUserStatus={onToggleUserStatus}
        onDeleteUser={onDeleteUser}
      />
    </div>
  );
}
