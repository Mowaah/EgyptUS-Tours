import Image from "next/image";
import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { PromotionRow } from "../types";
import styles from "./PromotionsPanel.module.scss";

const statusClass: Record<PromotionRow["status"], string> = {
  Active: styles.statusActive,
  Inactive: styles.statusInactive,
  Draft: styles.statusInactive,
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

export const usePromotionRowActions = (onDelete: (row: PromotionRow) => void) => {
  return (row: PromotionRow) => {
    const actions = [];
    if (row.status === "Active") {
      actions.push({
        label: "Inactive",
        // The user mentioned publish/unpublish icons but those don't exist in blog columns.
        // We'll leave iconSrc blank or omit it for now, since it's optional.
        onClick: () => {}
      });
    } else {
      actions.push({
        label: "Activate",
        onClick: () => {}
      });
    }
    
    actions.push({ 
      label: "View", 
      iconSrc: "/images/dashboard/view.svg",
      onClick: () => {}
    });
    actions.push({ 
      label: "Edit", 
      iconSrc: "/images/dashboard/edit.svg",
      onClick: () => {}
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
