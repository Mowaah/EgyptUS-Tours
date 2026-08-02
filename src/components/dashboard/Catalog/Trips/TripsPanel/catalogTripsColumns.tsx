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

export const catalogTripsColumns: DataTableColumn<any>[] = [
  {
    id: "id",
    header: "Trip ID",
    render: (row) => <span style={{ fontWeight: 600, color: "#1f2937" }}>{row.trip_code || row.id}</span>,
  },
  {
    id: "title",
    header: "Trip Name",
    render: (row) => row.title,
  },
  {
    id: "category",
    header: "Category",
    render: (row) => row.tags && row.tags.length > 0 ? row.tags.map((t: any) => t.name || t.title).join(", ") : "None",
  },
  {
    id: "destination",
    header: "Destination",
    render: (row) => row.destinations && row.destinations.length > 0 ? row.destinations.map((d: any) => d.name || d.title).join(", ") : "None",
  },
  {
    id: "duration",
    header: "Duration",
    render: (row) => row.duration_label || `${row.duration_days || 0} Days`,
  },
  {
    id: "startingFrom",
    header: "Starting From",
    render: (row) => row.starting_from || "N/A",
  },
  {
    id: "status",
    header: "Status",
    render: (row) => {
      const statusTitle = (row.status || "").charAt(0).toUpperCase() + (row.status || "").slice(1);
      return (
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
              row.status === "published" ? "#dcfce7" :
              row.status === "archived" ? "#ffedd5" : "#f3f4f6",
            color:
              row.status === "published" ? "#16a34a" :
              row.status === "archived" ? "#ea580c" : "#4b5563",
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
          {statusTitle}
        </span>
      );
    },
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
