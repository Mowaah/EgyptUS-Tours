import Image from "next/image";
import type { MetricCardData } from "../types";
import styles from "./MetricCard.module.scss";

interface MetricCardProps {
  card: MetricCardData;
}

const toneColors: Record<string, string> = {
  blue: "#2E93FA",
  green: "#3DB37C",
  orange: "#FF6600",
  purple: "#A855F7",
  pink: "#BE185D",
  amber: "#B45309",
  red: "#EF4444",
};

const TrendIcon = ({ trend }: { trend: "up" | "down" }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {trend === "up" ? (
      <path d="M23 6l-9.5 9.5-5-5L1 18m15-12h7v7" />
    ) : (
      <path d="M23 18l-9.5-9.5-5 5L1 6m15 12h7v-7" />
    )}
  </svg>
);

const generateJaggedPath = (seedStr: string, trend: "up" | "down") => {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = seedStr.charCodeAt(i) + ((seed << 5) - seed);
  }

  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  let y = trend === "up" ? 34 : 8;
  let path = `M0 ${y.toFixed(1)}`;

  for (let x = 2; x <= 208; x += 2) {
    let step = (random() - 0.5) * 5;
    y += step + (trend === "up" ? -0.25 : 0.25);

    if (random() > 0.9) y += (random() - 0.5) * 8;

    if (y < 2) y = 2;
    if (y > 40) y = 40;
    path += ` L${x} ${y.toFixed(1)}`;
  }
  return path;
};

export default function MetricCard({ card }: MetricCardProps) {
  const color = toneColors[card.tone] || "#2E93FA";
  const jaggedPath = generateJaggedPath(card.label, card.trend);

  return (
    <article className={`${styles.card} ${styles[card.tone]}`}>
      <div className={styles.top}>
        <span className={styles.icon} aria-hidden>
          <Image src={`/images/dashboard/${card.icon}.svg`} alt="" width={18} height={18} />
        </span>
        <span>{card.label}</span>
      </div>
      <div className={styles.valueRow}>
        <strong>{card.value}</strong>
        <span className={`${styles.trend} ${card.trend === "down" ? styles.down : ""}`}>
          {card.change}
          <TrendIcon trend={card.trend} />
        </span>
      </div>
      <svg className={styles.sparkline} viewBox="0 0 208 42" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={`gradient-${card.tone}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${jaggedPath} L208 42 L0 42 Z`} fill={`url(#gradient-${card.tone})`} />
      </svg>
    </article>
  );
}
