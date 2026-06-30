import styles from "./StatusPill.module.scss";

export type StatusPillVariant = "green" | "red" | "blue" | "orange" | "pink" | "gray";

interface StatusPillProps {
  label: React.ReactNode;
  variant: StatusPillVariant;
  hideDot?: boolean;
}

export default function StatusPill({ label, variant, hideDot = false }: StatusPillProps) {
  const variantClass = styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`];

  return (
    <span className={`${styles.pill} ${variantClass}`}>
      {!hideDot && <i aria-hidden />}
      {label}
    </span>
  );
}
