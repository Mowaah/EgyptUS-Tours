import { AdminUsersPanel } from "./AdminUsersPanel";
import type { AdminUserRow } from "./types";
import styles from "./UserManagement.module.scss";

interface UserManagementProps {
  onEditUser?: (user: AdminUserRow) => void;
  onToggleUserStatus?: (user: AdminUserRow) => void;
  onDeleteUser?: (user: AdminUserRow) => void;
}

export default function UserManagement({
  onEditUser,
  onToggleUserStatus,
  onDeleteUser,
}: UserManagementProps) {
  return (
    <div className={styles.page}>
      <AdminUsersPanel
        onEditUser={onEditUser}
        onToggleUserStatus={onToggleUserStatus}
        onDeleteUser={onDeleteUser}
      />
    </div>
  );
}
