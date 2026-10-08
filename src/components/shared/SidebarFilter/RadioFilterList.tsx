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
    <div className={styles.options} role="radiogroup">
      {options.map((opt, i) => {
        const label = typeof opt === "string" ? opt : opt.label;
        const value = typeof opt === "string" ? opt : opt.value;
        const id = `${name}-${value.replace(/[^a-zA-Z0-9_-]/g, "_")}-${i}`;
        return (
          <label key={`${value}-${i}`} className={styles.option} htmlFor={id}>
            <input
              id={id}
              type="radio"
              name={name}
              value={value}
              className={styles.hiddenInput}
              checked={selectedValue === value}
              onChange={() => onChange(value)}
              aria-label={label}
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
