import { InquiriesPanel } from "./InquiriesPanel";
import { LeadSummaryGrid } from "./LeadSummaryGrid";
import styles from "./LeadsInquiries.module.scss";

export default function LeadsInquiries() {
  return (
    <div className={styles.page}>
      <LeadSummaryGrid />
      <InquiriesPanel />
    </div>
  );
}
