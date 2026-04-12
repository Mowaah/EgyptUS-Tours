import { ReactNode } from "react";
import Image from "next/image";
import styles from "./FilterGroup.module.scss";

interface FilterGroupProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export default function FilterGroup({ title, isExpanded, onToggle, children }: FilterGroupProps) {
  return (
    <div className={`${styles.filterGroup} ${isExpanded ? styles.filterGroupExpanded : ""}`}>
      <div className={styles.filterHeader} onClick={onToggle}>
        <h4>{title}</h4>
        <Image 
          src="/images/arrows/arrow-down2.svg" 
          alt="Toggle filter" 
          width={15} 
          height={8} 
          className={`${styles.chevron} ${isExpanded ? styles.expanded : ""}`}
        />
      </div>
      {isExpanded && <div className={styles.content}>{children}</div>}
    </div>
  );
}
