import CustomersSummaryGrid from "./CustomersSummaryGrid/CustomersSummaryGrid";
import CustomersPanel from "./CustomersPanel/CustomersPanel";
import styles from "./Customers.module.scss";

interface CustomersProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function Customers({ searchQuery = "", onClearSearch }: CustomersProps) {
  return (
    <div className={styles.page}>
      <CustomersSummaryGrid />
      <CustomersPanel searchQuery={searchQuery} onClearSearch={onClearSearch} />
    </div>
  );
}
