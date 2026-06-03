import { AdminUsersPanel } from "./AdminUsersPanel";
import styles from "./UserManagement.module.scss";

export default function UserManagement() {
  return (
    <div className={styles.page}>
      <AdminUsersPanel />
    </div>
  );
}
