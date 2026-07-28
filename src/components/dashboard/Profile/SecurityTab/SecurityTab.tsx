"use client";

import { useState } from "react";
import { PasswordToggleButton } from "@/components/shared";
import { DashboardField, DashboardFooter, DashboardStatusBanner } from "@/components/dashboard/shared";
import styles from "./SecurityTab.module.scss";
import { changeAdminPassword } from "@/lib/adminApi";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export function SecurityTab() {
  const { adminUser } = useAdminAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await changeAdminPassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setSuccessMessage("Password has been changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.detail) {
        setErrorMessage(err.response.data.detail);
      } else if (err.response?.data?.confirm_password) {
        setErrorMessage(err.response.data.confirm_password[0] || "Passwords do not match.");
      } else if (err.response?.data?.new_password) {
        setErrorMessage(err.response.data.new_password[0] || "Invalid password format.");
      } else {
        setErrorMessage("An error occurred while changing password.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const isDirty = currentPassword !== "" || newPassword !== "" || confirmPassword !== "";

  const formattedDate = adminUser?.updated_at 
    ? new Date(adminUser.updated_at).toLocaleDateString('en-GB') 
    : "Never";

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>
            <span className={`${styles.assetIcon} ${styles.keyIcon}`} />
          </span>
          <h2 id="security-title">Change password</h2>
        </div>

        {errorMessage && (
          <DashboardStatusBanner 
            message={errorMessage} 
            variant="warning" 
            onClose={() => setErrorMessage("")} 
          />
        )}
        {successMessage && (
          <DashboardStatusBanner 
            message={successMessage} 
            variant="success" 
            onClose={() => setSuccessMessage("")} 
          />
        )}

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
      <DashboardFooter 
        lastUpdateDate={formattedDate} 
        onSave={handleSave} 
        onDiscard={handleDiscard}
        isSaveDisabled={!isDirty || isSaving}
        isDiscardDisabled={!isDirty || isSaving}
      />
    </div>
  );
}
