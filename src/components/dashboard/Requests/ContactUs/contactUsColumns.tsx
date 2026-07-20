import type { DataTableColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import type { StatusPillVariant } from "@/components/shared/StatusPill/StatusPill";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import type { ContactUsItem } from "./mockContactUsData";
import styles from "./ContactUs.module.scss";

export const getContactUsStatusVariant = (status: string): StatusPillVariant => {
  switch (status) {
    case "New":
      return "green";
    case "Replied":
      return "orangeLight";
    case "Closed":
      return "gray";
    default:
      return "gray";
  }
};

export const contactUsColumns: DataTableColumn<ContactUsItem>[] = [
  {
    id: "ref",
    header: "Ref",
    render: (row) => <span className={styles.idCell}>{row.ref}</span>,
  },
  {
    id: "fullName",
    header: "Full Name",
    render: (row) => <span>{row.fullName}</span>,
  },
  {
    id: "email",
    header: "Email",
    render: (row) => <span>{row.email}</span>,
  },
  {
    id: "message",
    header: "Message",
    render: (row) => <span className={styles.messageCell}>{row.message}</span>,
  },
  {
    id: "submittedOn",
    header: "Submitted On",
    render: (row) => <span className={styles.dateCell}>{row.submittedOn}</span>,
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <StatusPill 
        label={row.status} 
        variant={getContactUsStatusVariant(row.status)} 
      />
    ),
  },
  {
    id: "assigned",
    header: "Assigned",
    render: (row) => <span className={styles.agentCell}>{row.assigned}</span>,
  },
  {
    id: "actions",
    header: "",
    cellClassName: styles.actionCell,
    render: (row) => (
      <ViewButton onClick={() => window.location.href = `/dashboard/requests/contact-us/${row.id}`} />
    ),
  },
];
