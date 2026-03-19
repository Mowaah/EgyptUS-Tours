import styles from "./PaginationArrows.module.scss";

type Props = {
  children?: React.ReactNode;
  layout?: "inline" | "sides";
  size?: number;
  iconWidth?: number;
  iconHeight?: number;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  className?: string;
};

export default function PaginationArrows({
  children,
  layout,
  size = 44,
  iconWidth,
  iconHeight,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  className,
}: Props) {
  const resolvedLayout: "inline" | "sides" =
    layout ?? (children ? "sides" : "inline");

  return (
    <div
      className={[
        styles.root,
        resolvedLayout === "sides" ? styles.sides : styles.inline,
        className ?? "",
      ].join(" ")}
      style={{
        ["--pa-size" as string]: `${size}px`,
        ...(iconWidth ? { ["--pa-icon-w" as string]: `${iconWidth}px` } : {}),
        ...(iconHeight ? { ["--pa-icon-h" as string]: `${iconHeight}px` } : {}),
      }}
    >
      <button
        type="button"
        className={`${styles.button} ${styles.prev}`}
        aria-label="Previous"
        onClick={onPrev}
        disabled={prevDisabled}
      >
        <span className={styles.icon} aria-hidden="true" />
      </button>

      {children ? <div className={styles.content}>{children}</div> : null}

      <button
        type="button"
        className={`${styles.button} ${styles.next}`}
        aria-label="Next"
        onClick={onNext}
        disabled={nextDisabled}
      >
        <span className={styles.icon} aria-hidden="true" />
      </button>
    </div>
  );
}

