import { useState } from "react";
import { DashboardField, DashboardFooter, PasswordToggleButton } from "@/components/shared";
import styles from "./SecurityTab.module.scss";

export function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>
            <span className={`${styles.assetIcon} ${styles.keyIcon}`} />
          </span>
          <h2 id="security-title">Change password</h2>
        </div>

        {/* Form Fields Area */}
        <div className={styles.formArea}>
          <div className={styles.fullWidthRow}>
            <DashboardField
              id="security-current-password"
              variant="modal"
              label="Current password"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="**********"
              endAdornment={
                <PasswordToggleButton
                  isVisible={showCurrent}
                  className={styles.eyeBtn}
                  onToggle={() => setShowCurrent(!showCurrent)}
                />
              }
            />
          </div>
          
          <DashboardField
            id="security-new-password"
            variant="modal"
            label="New password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Password must be at least 8 characters long including one letter"
            endAdornment={
              <PasswordToggleButton
                isVisible={showNew}
                className={styles.eyeBtn}
                onToggle={() => setShowNew(!showNew)}
              />
            }
          />
          
          <DashboardField
            id="security-confirm-password"
            variant="modal"
            label="Confirm new password"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Please re-enter your password to confirm it matches."
            endAdornment={
              <PasswordToggleButton
                isVisible={showConfirm}
                className={styles.eyeBtn}
                onToggle={() => setShowConfirm(!showConfirm)}
              />
            }
          />
        </div>
      </div>

      {/* Footer Area */}
      <DashboardFooter lastUpdateDate="42/6/206" />
    </div>
  );
}
