"use client";


import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import TablePagination from "../shared/TablePagination/TablePagination";
import DashboardSearchEmptyState from "../DashboardEmptyState/DashboardSearchEmptyState";
import styles from "./DataTable.module.scss";
import type { DataTableProps, DataTableRowAction } from "./types";

const DEFAULT_PAGE_SIZES = [5, 10, 15];

interface ActionsCellProps<T> {
  row: T;
  rowId: string;
  openRowId: string | null;
  setOpenRowId: (id: string | null) => void;
  actions: DataTableRowAction<T>[];
}

function ActionsCell<T>({
  row,
  rowId,
  openRowId,
  setOpenRowId,
  actions,
}: ActionsCellProps<T>) {
  const [openUpward, setOpenUpward] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const cellRef = useRef<HTMLTableCellElement>(null);
  const isOpen = openRowId === rowId;

  const handleToggle = () => {
    if (!isOpen && cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 130;

      // Only open upward if there's no space below AND there is more space above
      const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
      
      setOpenUpward(shouldOpenUpward);
      setCoords({
        top: shouldOpenUpward ? rect.top - 4 : rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setOpenRowId(isOpen ? null : rowId);
  };

  return (
    <td ref={cellRef} className={styles.moreCell}>
      <div className={styles.menuWrapper}>
        <button
          type="button"
          className={`${styles.moreButton} ${
            isOpen ? styles.moreButtonActive : ""
          }`}
          aria-expanded={isOpen}
          aria-label={`More actions for ${rowId}`}
          onClick={handleToggle}
        >
          <span className={styles.dotsIcon} aria-hidden />
        </button>
        {isOpen && typeof document !== "undefined"
          ? createPortal(
              <div
                className={`${styles.rowMenu} ${
                  openUpward ? styles.rowMenuUpward : ""
                }`}
                style={{
                  position: "fixed",
                  top: openUpward ? "auto" : coords.top,
                  bottom: openUpward ? window.innerHeight - coords.top : "auto",
                  right: coords.right,
                  zIndex: 9999,
                }}
              >
                {actions.map((action) => (
                  <button
                    type="button"
                    key={action.label}
                    className={
                      action.variant === "danger"
                        ? styles.menuActionDanger
                        : action.variant === "success"
                        ? styles.menuActionSuccess
                        : action.variant === "warning"
                        ? styles.menuActionWarning
                        : styles.menuAction
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      action.onClick?.(row);
                      setOpenRowId(null);
                    }}
                  >
                    {action.iconSrc ? (
                      <span
                        className={styles.actionIcon}
                        style={{
                          maskImage: `url(${action.iconSrc})`,
                          WebkitMaskImage: `url(${action.iconSrc})`,
                        }}
                        aria-hidden
                      />
                    ) : null}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>,
              document.body
            )
          : null}
      </div>
    </td>
  );
}

export default function DataTable<T>({
  data,
  columns,
  getRowId,
  selectable = false,
  selectionType = "checkbox",
  selectedRowIds,
  onSelectionChange,
  rowActions,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  defaultPageSize = pageSizeOptions[0] ?? 5,
  serverSidePagination = false,
  totalCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
  isLoading = false,
}: DataTableProps<T>) {
  const [internalPage, setInternalPage] = useState(1);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(defaultPageSize);
  const [internalSelectedRows, setInternalSelectedRows] = useState<string[]>([]);
  const [openRowId, setOpenRowId] = useState<string | null>(null);

  const isControlled = selectedRowIds !== undefined;
  const selectedRows = isControlled ? selectedRowIds : internalSelectedRows;

  const isServerSide = serverSidePagination && totalCount !== undefined;
  const currentPage = isServerSide && pageIndex !== undefined ? pageIndex + 1 : internalPage;
  const currentRowsPerPage = isServerSide && pageSize !== undefined ? pageSize : internalRowsPerPage;

  useEffect(() => {
    if (openRowId === null) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.moreCell}`) && !target.closest(`.${styles.rowMenu}`)) {
        setOpenRowId(null);
      }
    };
    
    const handleScroll = (e: Event) => {
      // Don't close if they are just scrolling inside the rowMenu itself
      const target = e.target as HTMLElement;
      if (!target?.closest?.(`.${styles.rowMenu}`)) {
        setOpenRowId(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    window.addEventListener("scroll", handleScroll, { capture: true });
    
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [openRowId]);

  const pageCount = isServerSide 
    ? Math.max(1, Math.ceil((totalCount || 0) / currentRowsPerPage)) 
    : Math.max(1, Math.ceil(data.length / currentRowsPerPage));
  const safePage = Math.min(currentPage, pageCount);
  const visibleRows = isServerSide 
    ? data 
    : data.slice((safePage - 1) * currentRowsPerPage, safePage * currentRowsPerPage);
  const hasActions = Boolean(rowActions);

  const toggleRow = (id: string) => {
    const isCurrentlySelected = selectedRows.includes(id);
    
    if (onSelectionChange) {
      onSelectionChange(id, !isCurrentlySelected);
    }
    
    if (!isControlled) {
      setInternalSelectedRows((current) =>
        current.includes(id) ? current.filter((rowId) => rowId !== id) : [...current, id]
      );
    }
  };

  const handlePageChange = (p: number) => {
    if (isServerSide && onPageChange) {
      onPageChange(p - 1);
    } else {
      setInternalPage(p);
    }
  };

  const changeRowsPerPage = (value: number) => {
    if (isServerSide && onPageSizeChange) {
      onPageSizeChange(value);
      if (onPageChange) onPageChange(0);
    } else {
      setInternalRowsPerPage(value);
      setInternalPage(1);
    }
    setOpenRowId(null);
  };

  const wrapClassName = className ? `${styles.wrap} ${className}` : styles.wrap;

  return (
    <div className={wrapClassName}>
      <table>
        <thead>
          <tr>
            {selectable ? <th aria-label="Select visible rows" /> : null}
            {columns.map((column) => (
              <th key={column.id} aria-label={column.headerAriaLabel}>
                {column.header}
              </th>
            ))}
            {hasActions ? <th aria-label="Actions" /> : null}
          </tr>
        </thead>
        <tbody>
          {visibleRows.length === 0 && !isLoading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)}>
                <div style={{ padding: "40px 0" }}>
                  <DashboardSearchEmptyState />
                </div>
              </td>
            </tr>
          ) : (
            visibleRows.map((row, index) => {
              const rowId = getRowId(row);
              const isSelected = selectedRows.includes(rowId);
              const actions = rowActions?.(row);

              return (
                <tr
                  key={rowId}
                  className={isSelected && selectionType === "checkbox" ? styles.selectedRow : undefined}
                >
                  {selectable ? (
                    <td>
                      <input
                        type="checkbox"
                        className={selectionType === "star" ? styles.starCheckbox : undefined}
                        checked={isSelected}
                        onChange={() => toggleRow(rowId)}
                        aria-label={`Select row ${rowId}`}
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td key={column.id} className={column.cellClassName}>
                      {column.render(row)}
                    </td>
                  ))}
                  {hasActions && actions ? (
                    <ActionsCell
                      row={row}
                      rowId={rowId}
                      openRowId={openRowId}
                      setOpenRowId={setOpenRowId}
                      actions={actions}
                    />
                  ) : null}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <TablePagination
        page={currentPage}
        pageCount={pageCount}
        rowsPerPage={currentRowsPerPage}
        pageSizeOptions={pageSizeOptions}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={changeRowsPerPage}
      />
    </div>
  );
}
