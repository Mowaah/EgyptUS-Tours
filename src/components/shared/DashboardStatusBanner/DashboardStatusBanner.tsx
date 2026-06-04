import styles from "./DashboardStatusBanner.module.scss";

export type DashboardStatusBannerVariant = "success";

export interface DashboardStatusBannerProps {
  message: string;
  leaving?: boolean;
  variant?: DashboardStatusBannerVariant;
  className?: string;
}

export default function DashboardStatusBanner({
  message,
  leaving = false,
  variant = "success",
  className = "",
}: DashboardStatusBannerProps) {
  const bannerClassName = [
    styles.banner,
    styles[variant],
    leaving ? styles.leaving : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={bannerClassName} role="status" aria-live="polite">
      <span className={styles.icon} aria-hidden>
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm4.05 7.36-4.63 4.63a.9.9 0 0 1-1.27 0L7.95 12.8a.9.9 0 0 1 1.27-1.27l1.56 1.56 3.99-3.99a.9.9 0 0 1 1.28 1.27Z" />
        </svg>
      </span>
      <span>{message}</span>
    </div>
  );
}
