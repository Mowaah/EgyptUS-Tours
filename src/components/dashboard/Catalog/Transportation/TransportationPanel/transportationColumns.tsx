import { DataTableColumn, DataTableRowAction } from "@/components/dashboard/DataTable/types";

export const transportationColumns: DataTableColumn<any>[] = [
  {
    id: "id",
    header: "Vehicle ID",
    render: (row) => <span style={{ fontWeight: 600, color: "#1f2937" }}>{row.vehicle_code || row.id}</span>,
  },
  {
    id: "name",
    header: "Name",
    render: (row) => row.name,
  },
  {
    id: "category",
    header: "Category",
    render: (row) => row.category?.name || "-",
  },
  {
    id: "passengers",
    header: "Passengers",
    render: (row) => row.passengers?.toString() || "0",
  },
  {
    id: "luggage",
    header: "Luggage",
    render: (row) => row.luggage_capacity?.toString() || "0",
  },
  {
    id: "rating",
    header: "Rating",
    render: (row) => row.rating_avg || "0",
  },
  {
    id: "startingFrom",
    header: "Starting From",
    render: (row) => `$${row.starting_from || "0.00"}`,
  },
  {
    id: "status",
    header: "Status",
    render: (row) => {
      const statusLabel = row.status === "published" ? "Published" : row.status === "archived" ? "Archived" : "Draft";
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
          {statusLabel}
        </span>
      );
    }
  },
];

export const transportationRowActions = (
  onAction: (action: string, row: any) => void
): DataTableRowAction<any>[] => [
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
