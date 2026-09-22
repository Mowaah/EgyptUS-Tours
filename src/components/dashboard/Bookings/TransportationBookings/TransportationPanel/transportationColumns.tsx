import type { DataTableColumn, DataTableRowAction } from "@/components/dashboard/DataTable";
import type { TransportationBookingRow } from "../types";
import styles from "./TransportationPanel.module.scss";
import { parseDate } from "@/utils/dateFormat";

import Image from "next/image";

export const getPillStyle = (status: string) => {
  const map: Record<string, string> = {
    paid: styles.pillPaid,
    fully_paid: styles.pillPaid,
    pending: styles.pillPending,
    partially_paid: styles.pillPending,
    upcoming: styles.pillUpcoming,
    cancelled: styles.pillCanceled,
    canceled: styles.pillCanceled,
    refunded: styles.pillRefunded,
    no_refund: styles.pillNoRefund,
    no_refunded: styles.pillNoRefund,
    no_refunded_amount: styles.pillNoRefund,
    "no refund": styles.pillNoRefund,
    "no refunded amount": styles.pillNoRefund,
    on_trip: styles.pillOnTrip,
    completed: styles.pillCompleted,
    overdue: styles.pillOverdue,
    website: styles.pillWebsite,
    admin: styles.pillAgent,
  };
  return `${styles.pill} ${map[status?.toLowerCase()] || ""}`;
};

const formatDateTime = (dateStr: string, timeStr: string) => {
  if (!dateStr) return "-";
  const parsed = parseDate(dateStr);
  const date = parsed
    ? parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : dateStr;
  if (!timeStr) return date;
  return `${date} / ${timeStr.slice(0, 5)}`;
};

const getImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return `${apiUrl}${path}`;
};

export const transportationColumns: DataTableColumn<TransportationBookingRow>[] = [
  {
    id: "booking_code",
    header: "Booking ID",
    cellClassName: styles.idCell,
    render: (row) => row.booking_code,
  },
  {
    id: "customerName",
    header: "Customer",
    render: (row) => row.customer_name,
  },
  {
    id: "vehicleClass",
    header: "Vehicle Class",
    render: (row) => row.vehicle_class?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
  },
  {
    id: "dateTime",
    header: "Date / Time",
    render: (row) => formatDateTime(row.pickup_date, row.pickup_time),
  },
  {
    id: "route",
    header: "Route",
    render: (row) => row.route,
  },

  {
    id: "paymentStatus",
    header: "Payment",
    render: (row) => {
      const op = row.operational_status?.toLowerCase();
      if (
        op === "cancelled" ||
        op === "refunded" ||
        op === "no_refund" ||
        op === "no_refunded" ||
        op === "no_refunded_amount" ||
        !row.remaining_payment_status
      ) {
        return <span className={styles.emptyDash}>-</span>;
      }
      return (
        <span className={getPillStyle(row.remaining_payment_status)}>
          <i aria-hidden />
          {row.remaining_payment_status.charAt(0).toUpperCase() + row.remaining_payment_status.slice(1)}
        </span>
      );
    },
  },
  {
    id: "operationalStatus",
    header: "Status",
    render: (row) => {
      const op = row.operational_status?.toLowerCase();
      let label = row.operational_status
        ? row.operational_status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : "-";

      const refAmt = Number(row.refunded_amount);
      if (
        op === "no_refund" ||
        op === "no_refunded" ||
        op === "no_refunded_amount" ||
        (op === "refunded" && !isNaN(refAmt) && refAmt === 0 && row.refunded_amount != null)
      ) {
        label = "No Refunded Amount";
      }

      return (
        <span className={getPillStyle(label === "No Refunded Amount" ? "no_refunded_amount" : row.operational_status)}>
          <i aria-hidden />
          {label}
        </span>
      );
    },
  },
  {
    id: "source",
    header: "Source",
    hidden: true,
    render: (row) => (
      <span className={getPillStyle(row.source)}>
        {row.source === "website" ? (
          <Image src="/images/dashboard/customers/custom/website.svg" alt="" width={14} height={14} aria-hidden />
        ) : (row.source === "admin" || row.source === "agent") ? (
          <Image src="/images/dashboard/customers/custom/agent.svg" alt="" width={14} height={14} aria-hidden />
        ) : (
          <i aria-hidden />
        )}
        {row.source ? (row.source === "admin" ? "Agent" : row.source.charAt(0).toUpperCase() + row.source.slice(1)) : "-"}
      </span>
    ),
  },
  {
    id: "assignedTo",
    header: "Assigned",
    render: (row) => (
      <div className={styles.agentCell}>
        {row.assigned_to ? (
          <>
            {row.assigned_to.profile_picture ? (
              <Image
                src={getImageUrl(row.assigned_to.profile_picture)}
                alt=""
                width={39}
                height={39}
                className={styles.agentAvatarImg}
              />
            ) : (
              <div className={styles.agentAvatar}>{row.assigned_to.full_name.charAt(0)}</div>
            )}
            <span>{row.assigned_to.full_name}</span>
          </>
        ) : (
          <span className={styles.unassigned}>Unassigned</span>
        )}
      </div>
    ),
  },
];

export const transportationRowActions = (
  row: TransportationBookingRow,
  onAction?: (action: string, row: TransportationBookingRow) => void,
  canEdit: boolean = true
): DataTableRowAction<TransportationBookingRow>[] => {
  const actions: DataTableRowAction<TransportationBookingRow>[] = [
    {
      label: "View",
      iconSrc: "/images/dashboard/view.svg",
      onClick: (r: TransportationBookingRow) => {
        if (onAction) onAction("View", r);
      },
    },
  ];

  if (!canEdit) {
    return actions;
  }

  const op = row.operational_status?.toLowerCase();
  const isCompleted = op === "completed";
  const isCancelled =
    op === "cancelled" ||
    op === "canceled" ||
    row.status?.toLowerCase() === "cancelled" ||
    row.status?.toLowerCase() === "canceled";
  const isRefunded =
    op === "refunded" ||
    op === "no_refund" ||
    op === "no_refunded" ||
    op === "no_refunded_amount" ||
    row.remaining_payment_status?.toLowerCase() === "refunded" ||
    row.payment_status?.toLowerCase() === "refunded";
  const isInProgress =
    op === "in_transit" ||
    op === "in transit" ||
    op === "on_trip" ||
    op === "in_trip" ||
    op === "on trip" ||
    op === "in trip";

  if (!isCompleted && !isRefunded && !isInProgress) {
    actions.push({
      label: "Assign To",
      iconSrc: "/images/dashboard/assign.svg",
      onClick: (r: TransportationBookingRow) => {
        if (onAction) onAction("Assign To", r);
      },
    });

    if (!isCancelled) {
      actions.push({
        label: "Send Email Reminder",
        iconSrc: "/images/dashboard/booking/trips/notification-bing.svg",
        onClick: (r: TransportationBookingRow) => {
          if (onAction) onAction("Send Email Reminder", r);
        },
      });
    }
  }

  return actions;
};
