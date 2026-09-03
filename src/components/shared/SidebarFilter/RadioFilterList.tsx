import CheckboxIndicator from "@/components/shared/CheckboxIndicator/CheckboxIndicator";
import styles from "./RadioFilterList.module.scss";

type FilterOption = string | { label: string; value: string };

interface RadioFilterListProps {
  options: FilterOption[];
  name: string;
  selectedValue: string;
  onChange: (val: string) => void;
}

export default function RadioFilterList({ options, name, selectedValue, onChange }: RadioFilterListProps) {
  return (
    <div className={styles.options}>
      {options.map((opt, i) => {
        const label = typeof opt === "string" ? opt : opt.label;
        const value = typeof opt === "string" ? opt : opt.value;
        return (
          <label key={`${value}-${i}`} className={styles.option}>
            <input
              type="radio"
              name={name}
              className={styles.hiddenInput}
              checked={selectedValue === value}
              onChange={() => onChange(value)}
            />
            <CheckboxIndicator
              variant="radio"
              size="md"
              emphasis="filter"
              selected={selectedValue === value}
              aria-hidden
            />
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  );
}
