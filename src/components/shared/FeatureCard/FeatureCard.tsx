import styles from "./FeatureCard.module.scss";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
  backgroundColor?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  color = "#2563EB",
  backgroundColor,
}: FeatureCardProps) {
  const cardBackground = backgroundColor ?? `${color}10`;
  const borderColor = `${color}26`;

  return (
    <div
      className={styles.card}
      style={{ backgroundColor: cardBackground, borderColor }}
    >
      <div
        className={styles.iconWrapper}
        style={{ backgroundColor: `${color}10`, color }}
      >
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
