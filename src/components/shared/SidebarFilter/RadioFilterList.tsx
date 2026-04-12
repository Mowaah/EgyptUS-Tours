import CheckboxIndicator from "@/components/shared/CheckboxIndicator/CheckboxIndicator";
import styles from "./RadioFilterList.module.scss";

interface RadioFilterListProps {
  options: string[];
  name: string;
  selectedValue: string;
  onChange: (val: string) => void;
}

export default function RadioFilterList({ options, name, selectedValue, onChange }: RadioFilterListProps) {
  return (
    <div className={styles.options}>
      {options.map((opt, i) => (
        <label key={`${opt}-${i}`} className={styles.option}>
          <input
            type="radio"
            name={name}
            className={styles.hiddenInput}
            checked={selectedValue === opt}
            onChange={() => onChange(opt)}
          />
          <CheckboxIndicator
            variant="radio"
            size="md"
            emphasis="filter"
            selected={selectedValue === opt}
            aria-hidden
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}
