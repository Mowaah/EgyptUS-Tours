import Image from "next/image";
import { type DataTableColumn, type DataTableRowAction } from "@/components/dashboard/DataTable/types";
import { HotelBookingRow } from "../types";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import styles from "./HotelsPanel.module.scss";

export const hotelsRowActions = (
  row: HotelBookingRow,
  onAction?: (action: string, row: HotelBookingRow) => void,
  canEdit: boolean = true
): DataTableRowAction<HotelBookingRow>[] => {
  const actions: DataTableRowAction<HotelBookingRow>[] = [
    {
      label: "View",
      iconSrc: "/images/dashboard/view.svg",
      onClick: (r: HotelBookingRow) => {
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
    op === "in_hotel" ||
    op === "in_stay" ||
    op === "on_trip" ||
    op === "in_trip" ||
    op === "in hotel" ||
    op === "in stay" ||
    op === "in_transit" ||
    op === "in transit";

  if (!isCompleted && !isRefunded && !isInProgress) {
    actions.push({
      label: "Assign To",
      iconSrc: "/images/dashboard/assign.svg",
      onClick: (r: HotelBookingRow) => {
        if (onAction) onAction("Assign To", r);
      },
    });

    if (!isCancelled) {
      actions.push({
        label: "Send Email Reminder",
        iconSrc: "/images/dashboard/booking/trips/notification-bing.svg",
        onClick: (r: HotelBookingRow) => {
          if (onAction) onAction("Send Email Reminder", r);
        },
      });
    }
  }

  return actions;
};

const getImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return `${apiUrl}${path}`;
};

export const hotelsColumns: DataTableColumn<HotelBookingRow>[] = [
  {
    id: "booking_code",
    header: "Booking ID",
    render: (row) => <span className={styles.idCell}>{row.booking_code}</span>,
  },
  {
    id: "customerName",
    header: "Customer",
    render: (row) => <span className={styles.textCell}>{row.customer_name}</span>,
  },
  {
    id: "checkIn",
    header: "Check-in",
    render: (row) => {
      if (!row.check_in_date) return <span className={styles.emptyDash}>-</span>;
      const [y, m, d] = row.check_in_date.split("-");
      return <span className={styles.textCell}>{`${d}/${m}/${y}`}</span>;
    },
  },
  {
    id: "checkOut",
    header: "Check-out",
    render: (row) => {
      if (!row.check_out_date) return <span className={styles.emptyDash}>-</span>;
      const [y, m, d] = row.check_out_date.split("-");
      return <span className={styles.textCell}>{`${d}/${m}/${y}`}</span>;
    },
  },
  {
    id: "roomsCount",
    header: "Rooms",
    render: (row) => {
      const count = row.rooms_count;
      return (
        <span className={styles.roomsBadge}>
          <Image src="/images/dashboard/booking/hotels/rooms.svg" alt="" width={16} height={16} />
          {count} Rooms
        </span>
      );
    },
  },
  {
    id: "dateTime",
    header: "Date / Time",
    render: (row) => {
      if (!row.created_at) return <span className={styles.emptyDash}>-</span>;
      const d = new Date(row.created_at);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
      return <span className={styles.textCell}>{`${day}/${month}/${year} ${time}`}</span>;
    },
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
      const rem = row.remaining_payment_status?.toLowerCase();
      let variant: "green" | "orange" | "red" | "pink" | "blue" = "orange";
      if (rem === "paid") variant = "green";
      else if (rem === "overdue") variant = "red";

      const display = row.remaining_payment_status ? row.remaining_payment_status.charAt(0).toUpperCase() + row.remaining_payment_status.slice(1) : "-";
      return <StatusPill label={display} variant={variant} />;
    },
  },
  {
    id: "operationalStatus",
    header: "Status",
    render: (row) => {
      const status = row.operational_status;
      const op = status?.toLowerCase();
      const refAmt = Number(row.refunded_amount);
      const isNoRefund =
        op === "no_refund" ||
        op === "no_refunded" ||
        op === "no_refunded_amount" ||
        (op === "refunded" && !isNaN(refAmt) && refAmt === 0 && row.refunded_amount != null);
      const isInHotel = op === "in_stay" || op === "in_hotel" || op === "in stay" || op === "in hotel" || op === "on_trip";

      const variant = status === "upcoming"
        ? "blue"
        : status === "completed"
        ? "green"
        : isInHotel
        ? "orange"
        : isNoRefund
        ? "gray"
        : op === "refunded"
        ? "pink"
        : "red";

      const display = isNoRefund
        ? "No Refunded Amount"
        : isInHotel
        ? "In Hotel"
        : (status ? status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "-");

      return <StatusPill label={display} variant={variant} />;
    },
  },
  {
    id: "source",
    header: "Source",
    hidden: true,
    render: (row) => {
      const source = row.source;
      const variant = source === "website" ? "blue" : "pink";
      const icon = source === "website" ? "/images/dashboard/customers/custom/website.svg" : "/images/dashboard/customers/custom/agent.svg";
      const label = (
        <span className={styles.sourceLabel}>
          <Image src={icon} alt="" width={14} height={14} aria-hidden />
          {source === "admin" ? "Agent" : source}
        </span>
      );
      return <StatusPill label={label} variant={variant} hideDot />;
    },
  },
  {
    id: "assignedAgent",
    header: "Assigned Agent",
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
