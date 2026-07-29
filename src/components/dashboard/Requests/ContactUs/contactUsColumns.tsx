import type { DataTableColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import type { StatusPillVariant } from "@/components/shared/StatusPill/StatusPill";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import styles from "./ContactUs.module.scss";

export const getContactUsStatusVariant = (status: string): StatusPillVariant => {
  switch (status?.toLowerCase()) {
    case "new":
      return "green";
    case "replied":
    case "in_progress":
      return "orangeLight";
    case "closed":
      return "gray";
    default:
      return "gray";
  }
};

export const contactUsColumns: DataTableColumn<any>[] = [
  {
    id: "inquiry_code",
    header: "Ref",
    render: (row) => <span className={styles.idCell}>{row.inquiry_code}</span>,
  },
  {
    id: "full_name",
    header: "Full Name",
    render: (row) => <span>{row.full_name}</span>,
  },
  {
    id: "email",
    header: "Email",
    render: (row) => <span>{row.email}</span>,
  },
  {
    id: "message_preview",
    header: "Message",
    render: (row) => <span className={styles.messageCell}>{row.message_preview}</span>,
  },
  {
    id: "submitted_on",
    header: "Submitted On",
    render: (row) => {
      let dateStr = "-";
      if (row.submitted_on) {
        const date = new Date(row.submitted_on);
        dateStr = `${date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
      }
      return <span className={styles.dateCell}>{dateStr}</span>;
    },
  },
  {
    id: "display_status",
    header: "Status",
    render: (row) => (
      <StatusPill 
        label={row.display_status || row.status} 
        variant={getContactUsStatusVariant(row.status)} 
      />
    ),
  },
  {
    id: "assigned_to",
    header: "Assigned",
    render: (row) => <span className={styles.agentCell}>{row.assigned_to?.full_name || "-"}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    render: (row) => <ViewAction id={row.id} />,
  },
];

import { useRouter } from "next/navigation";

function ViewAction({ id }: { id: number }) {
  const router = useRouter();
  return <ViewButton onClick={() => router.push(`/dashboard/requests/contact-us/${id}`)} />;
}
