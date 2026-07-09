import Image from "next/image";
import { type DataTableColumn } from "@/components/dashboard/DataTable/types";
import { HotelBookingData } from "../types";
import StatusPill from "@/components/shared/StatusPill/StatusPill";

export const hotelsRowActions = (onAction: (action: string, row: HotelBookingData) => void) => [
  { label: "View", iconSrc: "/images/dashboard/view.svg", onClick: (row: HotelBookingData) => onAction("View", row) },
  { label: "Re-Assign To", iconSrc: "/images/dashboard/assign.svg", onClick: (row: HotelBookingData) => onAction("Re-Assign To", row) },
  { label: "Send Email Reminder", iconSrc: "/images/dashboard/booking/trips/notification-bing.svg", onClick: (row: HotelBookingData) => onAction("Send Email Reminder", row) },
];

export const hotelsColumns: DataTableColumn<HotelBookingData>[] = [
  {
    id: "id",
    header: "Booking ID",
    render: (row) => <span style={{ fontWeight: 700, color: "#111827" }}>{row.id}</span>,
  },
  {
    id: "customerName",
    header: "Customer",
    render: (row) => <span style={{ color: "#4B5563" }}>{row.customerName}</span>,
  },
  {
    id: "checkIn",
    header: "Check-in",
    render: (row) => <span style={{ color: "#4B5563" }}>{row.checkIn}</span>,
  },
  {
    id: "checkOut",
    header: "Check-out",
    render: (row) => <span style={{ color: "#4B5563" }}>{row.checkOut}</span>,
  },
  {
    id: "roomsCount",
    header: "Rooms",
    render: (row) => {
      const count = row.roomsCount;
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
    render: (row) => <span style={{ color: "#4B5563" }}>{row.dateTime}</span>,
  },
  {
    id: "paymentStatus",
    header: "Remaining 70%",
    render: (row) => {
      const status = row.paymentStatus;
      const variant = status === "Paid" ? "green" : status === "Pending" ? "orange" : "red";
      return <StatusPill label={status} variant={variant} />;
    },
  },
  {
    id: "status",
    header: "Status",
    render: (row) => {
      const status = row.status;
      const variant = status === "Upcoming" ? "blue" : status === "Completed" ? "green" : status === "On Trip" ? "orange" : status === "Refunded" ? "pink" : "red";
      return <StatusPill label={status} variant={variant} />;
    },
  },
  {
    id: "source",
    header: "Source",
    render: (row) => {
      const source = row.source;
      const variant = source === "Website" ? "blue" : "pink";
      const icon = source === "Website" ? "/images/dashboard/customers/custom/website.svg" : "/images/dashboard/customers/custom/agent.svg";
      const label = (
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Image src={icon} alt="" width={14} height={14} aria-hidden />
          {source}
        </span>
      );
      return <StatusPill label={label} variant={variant} hideDot />;
    },
  },
  {
    id: "assignedAgent",
    header: "Assigned",
    render: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "max-content" }}>
        <Image
          src={row.assignedAgent === "Sara M." ? "/images/dashboard/sara.jpg" : "/images/dashboard/sidebar/user-management.svg"}
          alt={row.assignedAgent}
          width={32}
          height={32}
          style={{ 
            borderRadius: "32px", 
            objectFit: "cover",
            ...(row.assignedAgent !== "Sara M." && { background: "#F0F1F3", padding: "6px" })
          }}
        />
        <span style={{ color: "#4B5563", fontSize: "14px", fontWeight: 400, whiteSpace: "nowrap" }}>{row.assignedAgent}</span>
      </div>
    ),
  },
];
