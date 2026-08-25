import { DataTableColumn, DataTableRowAction } from "@/components/dashboard/DataTable/types";

interface CatalogHotelRow {
  id: string | number;
  hotel_code?: string;
  name?: string;
  location?: { name?: string };
  location_text?: string;
  stars?: number | string;
  starting_from?: string;
  status?: string;
}

export const catalogHotelsColumns: DataTableColumn<CatalogHotelRow>[] = [
  {
    id: "hotel_code",
    header: "Hotel Code",
    render: (row) => <span style={{ fontWeight: 600, color: "#1f2937" }}>{row.hotel_code || row.id}</span>,
  },
  {
    id: "name",
    header: "Hotel Name",
    render: (row) => row.name,
  },
  {
    id: "location",
    header: "Location",
    render: (row) => row.location?.name || row.location_text || "-",
  },
  {
    id: "stars",
    header: "Rating",
    render: (row) => (row.stars ? `${row.stars} Stars` : "Unrated"),
  },
  {
    id: "startingFrom",
    header: "Starting From",
    render: (row) => row.starting_from ? `£${row.starting_from}` : "-",
  },
  {
    id: "status",
    header: "Status",
    render: (row) => {
      // Map backend status to Title Case (backend returns lowercase 'published', 'draft', 'archived')
      const s = String(row.status || "").toLowerCase();
      const statusLabel = s === "published" ? "Published" :
                          s === "archived" ? "Archived" : "Draft";
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
              statusLabel === "Published" ? "#dcfce7" :
              statusLabel === "Archived" ? "#ffedd5" : "#f3f4f6",
            color:
              statusLabel === "Published" ? "#16a34a" :
              statusLabel === "Archived" ? "#ea580c" : "#4b5563",
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
    },
  },
];

export const catalogHotelsRowActions = (
  onAction: (action: string, row: CatalogHotelRow) => void
): DataTableRowAction<CatalogHotelRow>[] => [
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
