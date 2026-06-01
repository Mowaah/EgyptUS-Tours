import styles from "./Legend.module.scss";

interface LegendItem {
  name?: string;
  label?: string;
  color: string;
}

export default function Legend({ items }: { items: LegendItem[] }) {
  return (
    <div className={styles.legend}>
      {items.map((item) => (
        <span key={item.name ?? item.label}>
          <i style={{ backgroundColor: item.color }} />
          {item.name ?? item.label}
        </span>
      ))}
    </div>
  );
}
