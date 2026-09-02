import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { PromotionRow } from "../types";
import { useRouter } from "next/navigation";
import styles from "./PromotionsPanel.module.scss";

const statusClass: Record<PromotionRow["status"], string> = {
  Active: styles.statusActive,
  Inactive: styles.statusInactive,
  Draft: styles.statusDraft,
  Expired: styles.statusExpired,
};

const appliesToClass: Record<PromotionRow["appliesTo"], string> = {
  Trips: styles.appliesTrips,
  Transportation: styles.appliesTransport,
  Hotels: styles.appliesHotels,
};

export const promotionsColumns: DataTableColumn<PromotionRow>[] = [
  {
    id: "offerId",
    header: "Offer ID",
    cellClassName: styles.idCell,
    render: (row) => row.offerId,
  },
  {
    id: "title",
    header: "Title",
    render: (row) => row.title,
  },
  {
    id: "value",
    header: "Value",
    render: (row) => row.value,
  },
  {
    id: "appliesTo",
    header: "Applies To",
    render: (row) => (
      <span className={`${styles.pill} ${appliesToClass[row.appliesTo]}`}>
        {row.appliesTo}
      </span>
    ),
  },
  {
    id: "validFrom",
    header: "Valid From",
    render: (row) => row.validFrom,
  },
  {
    id: "validTo",
    header: "Valid To",
    render: (row) => row.validTo,
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <span className={`${styles.pill} ${styles.pillWithDot} ${statusClass[row.status]}`}>
        <i aria-hidden />
        {row.status}
      </span>
    ),
  },
  {
    id: "usage",
    header: "Usage",
    render: (row) => row.usage,
  },
];

export const usePromotionRowActions = (
  onDelete: (row: PromotionRow) => void,
  onToggleStatus: (row: PromotionRow) => void
) => {
  const router = useRouter();
  
  return (row: PromotionRow) => {
    const actions = [];
    if (row.status === "Active") {
      actions.push({
        label: "Inactive",
        iconSrc: "/images/dashboard/unpublish.svg",
        variant: "warning" as const,
        onClick: () => onToggleStatus(row)
      });
    } else if (row.status === "Inactive") {
      actions.push({
        label: "Activate",
        iconSrc: "/images/dashboard/publish.svg",
        variant: "success" as const,
        onClick: () => onToggleStatus(row)
      });
    }
    
    actions.push({ 
      label: "View", 
      iconSrc: "/images/dashboard/view.svg",
      onClick: () => router.push(`/dashboard/marketing/promotions/${row.id}`)
    });
    actions.push({ 
      label: "Edit", 
      iconSrc: "/images/dashboard/edit.svg",
      onClick: () => router.push(`/dashboard/marketing/promotions/${row.id}/edit?from=list`)
    });
    actions.push({ 
      label: "Delete Offer", 
      iconSrc: "/images/dashboard/delete.svg", 
      variant: "danger" as const,
      onClick: () => onDelete(row)
    });
    return actions;
  };
};
