import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  id: string;
  header?: ReactNode;
  /** Use when the column has no visible header (e.g. checkbox / actions). */
  headerAriaLabel?: string;
  cellClassName?: string;
  render: (row: T) => ReactNode;
}

export interface DataTableRowAction<T> {
  label: string;
  variant?: "default" | "primary" | "danger" | "success" | "warning";
  iconSrc?: string;
  onClick?: (row: T) => void;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  /** Show a leading checkbox column with row selection. */
  selectable?: boolean;
  selectionType?: "checkbox" | "star";
  selectedRowIds?: string[];
  onSelectionChange?: (rowId: string, isSelected: boolean) => void;
  /** Optional per-row overflow menu (⋯). */
  rowActions?: (row: T) => DataTableRowAction<T>[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  serverSidePagination?: boolean;
  totalCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  /** When true, suppresses the empty state so the table doesn't flash "No Results" during a fetch. */
  isLoading?: boolean;
}
