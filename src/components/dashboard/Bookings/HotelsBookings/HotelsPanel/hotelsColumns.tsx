import Image from "next/image";
import { type DataTableColumn } from "@/components/dashboard/DataTable/types";
import { HotelBookingRow } from "../types";
import StatusPill from "@/components/shared/StatusPill/StatusPill";

export const hotelsRowActions = (onAction: (action: string, row: HotelBookingRow) => void) => [
  { label: "View", iconSrc: "/images/dashboard/view.svg", onClick: (row: HotelBookingRow) => onAction("View", row) },
  { label: "Re-Assign To", iconSrc: "/images/dashboard/assign.svg", onClick: (row: HotelBookingRow) => onAction("Re-Assign To", row) },
  { label: "Send Email Reminder", iconSrc: "/images/dashboard/booking/trips/notification-bing.svg", onClick: (row: HotelBookingRow) => onAction("Send Email Reminder", row) },
];

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
    render: (row) => <span style={{ fontWeight: 700, color: "#111827" }}>{row.booking_code}</span>,
  },
  {
    id: "customerName",
    header: "Customer",
    render: (row) => <span style={{ color: "#4B5563" }}>{row.customer_name}</span>,
  },
  {
    id: "checkIn",
    header: "Check-in",
    render: (row) => <span style={{ color: "#4B5563" }}>{row.check_in_date}</span>,
  },
  {
    id: "checkOut",
    header: "Check-out",
    render: (row) => <span style={{ color: "#4B5563" }}>{row.check_out_date}</span>,
  },
  {
    id: "roomsCount",
    header: "Rooms",
    render: (row) => {
      const count = row.rooms_count;
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 8px",
            background: "#E5F0FF",
            color: "#0E5FD9",
            borderRadius: "100px",
            fontSize: "12px",
            fontWeight: 700,
            whiteSpace: "nowrap",
            width: "max-content",
            flexShrink: 0,
          }}
        >
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
      const d = new Date(row.created_at);
      return <span style={{ color: "#4B5563" }}>{d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>;
    },
  },
  {
    id: "paymentStatus",
    header: "Payment",
    render: (row) => {
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
      const variant = status === "upcoming" ? "blue" : status === "completed" ? "green" : status === "on_trip" ? "orange" : status === "refunded" ? "pink" : "red";
      const display = status ? status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "-";
      return <StatusPill label={display} variant={variant} />;
    },
  },
  {
    id: "source",
    header: "Source",
    render: (row) => {
      const source = row.source;
      const variant = source === "website" ? "blue" : "pink";
      const icon = source === "website" ? "/images/dashboard/customers/custom/website.svg" : "/images/dashboard/customers/custom/agent.svg";
      const label = (
        <span style={{ display: "flex", alignItems: "center", gap: "6px", textTransform: "capitalize" }}>
          <Image src={icon} alt="" width={14} height={14} aria-hidden />
          {source}
        </span>
      );
      return <StatusPill label={label} variant={variant} hideDot />;
    },
  },
  {
    id: "assignedAgent",
    header: "Assigned Agent",
    render: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {row.assigned_to ? (
          <>
            {row.assigned_to.profile_picture ? (
              <Image src={getImageUrl(row.assigned_to.profile_picture)} alt="" width={32} height={32} style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#475569", flexShrink: 0 }}>
                {row.assigned_to.full_name.charAt(0)}
              </div>
            )}
            <span style={{ color: "#111827" }}>{row.assigned_to.full_name}</span>
          </>
        ) : (
          <span style={{ color: "#94a3b8" }}>Unassigned</span>
        )}
      </div>
    ),
  },
];
