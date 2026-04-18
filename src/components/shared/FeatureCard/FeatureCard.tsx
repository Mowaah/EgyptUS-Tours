import styles from "./FeatureCard.module.scss";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  cardBg?: string;
  borderColor?: string;
  iconBg?: string;
  color?: string; // fallback
}

export default function FeatureCard({
  icon,
  title,
  description,
  cardBg,
  borderColor,
  iconBg,
  color = "#2563EB",
}: FeatureCardProps) {
  const finalCardBg = cardBg ?? `${color}10`;
  const finalBorderColor = borderColor ?? `${color}26`;
  const finalIconBg = iconBg ?? `${color}10`;

  return (
    <div
      className={styles.card}
      style={{ backgroundColor: finalCardBg, borderColor: finalBorderColor }}
    >
      <div
        className={styles.iconWrapper}
        style={{ backgroundColor: finalIconBg, color }} // text color still driven by `color` if svg uses currentColor
      >
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
