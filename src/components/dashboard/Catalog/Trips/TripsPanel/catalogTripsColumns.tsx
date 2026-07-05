import { DataTableColumn, DataTableRowAction } from "@/components/dashboard/DataTable/types";
import { CatalogTrip } from "../mockCatalogTrips";

const getStatusVariant = (status: CatalogTrip["status"]) => {
  switch (status) {
    case "Published":
      return "success";
    case "Archived":
      return "warning";
    case "Draft":
    default:
      return "default";
  }
};

export const catalogTripsColumns: DataTableColumn<CatalogTrip>[] = [
  {
    id: "id",
    header: "Trip ID",
    render: (row) => <span style={{ fontWeight: 600, color: "#1f2937" }}>{row.id}</span>,
  },
  {
    id: "tripName",
    header: "Trip Name",
    render: (row) => row.tripName,
  },
  {
    id: "category",
    header: "Category",
    render: (row) => row.category,
  },
  {
    id: "destination",
    header: "Destination",
    render: (row) => row.destination,
  },
  {
    id: "duration",
    header: "Duration",
    render: (row) => row.duration,
  },
  {
    id: "startingFrom",
    header: "Starting From",
    render: (row) => row.startingFrom,
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 8px",
          borderRadius: "100px",
          fontSize: "12px",
          fontWeight: 500,
          backgroundColor:
            row.status === "Published" ? "#dcfce7" :
            row.status === "Archived" ? "#ffedd5" : "#f3f4f6",
          color:
            row.status === "Published" ? "#16a34a" :
            row.status === "Archived" ? "#ea580c" : "#4b5563",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "currentColor",
          }}
        />
        {row.status}
      </span>
    ),
  },
];

export const catalogTripsRowActions = (
  onAction: (action: string, row: CatalogTrip) => void
): DataTableRowAction<CatalogTrip>[] => [
  {
    label: "View",
    iconSrc: "/images/dashboard/view.svg",
    onClick: (row) => onAction("View", row),
  },
  {
    label: "Edit",
    iconSrc: "/images/dashboard/edit.svg",
    onClick: (row) => onAction("Edit", row),
  },
  {
    label: "Archive",
    iconSrc: "/images/dashboard/catalog/trips/archive.svg",
    onClick: (row) => onAction("Archive", row),
  },
  {
    label: "Delete",
    iconSrc: "/images/dashboard/delete.svg",
    variant: "danger",
    onClick: (row) => onAction("Delete", row),
  },
];
