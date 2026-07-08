"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import TablePagination from "../shared/TablePagination/TablePagination";
import styles from "./DataTable.module.scss";
import type { DataTableProps, DataTableRowAction } from "./types";

const DEFAULT_PAGE_SIZES = [5, 10, 15];

interface ActionsCellProps<T> {
  row: T;
  rowId: string;
  openRowId: string | null;
  setOpenRowId: (id: string | null) => void;
  actions: DataTableRowAction<T>[];
  isLastRow: boolean;
}

function ActionsCell<T>({
  row,
  rowId,
  openRowId,
  setOpenRowId,
  actions,
  isLastRow,
}: ActionsCellProps<T>) {
  const [openUpward, setOpenUpward] = useState(false);
  const cellRef = useRef<HTMLTableCellElement>(null);
  const isOpen = openRowId === rowId;

  const handleToggle = () => {
    if (!isOpen && cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const dropdownHeight = 130;

      if (isLastRow || (spaceBelow < dropdownHeight && rect.top > spaceBelow)) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
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
        {isOpen ? (
          <div
            className={`${styles.rowMenu} ${
              openUpward ? styles.rowMenuUpward : ""
            }`}
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
          </div>
        ) : null}
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
  rowActions,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  defaultPageSize = pageSizeOptions[0] ?? 5,
  className,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openRowId, setOpenRowId] = useState<string | null>(null);

  useEffect(() => {
    if (openRowId === null) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.moreCell}`)) {
        setOpenRowId(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [openRowId]);

  const pageCount = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const visibleRows = data.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);
  const hasActions = Boolean(rowActions);

  const toggleRow = (id: string) => {
    setSelectedRows((current) =>
      current.includes(id) ? current.filter((rowId) => rowId !== id) : [...current, id]
    );
  };

  const changeRowsPerPage = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
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
          {visibleRows.map((row, index) => {
            const rowId = getRowId(row);
            const isSelected = selectedRows.includes(rowId);
            const actions = rowActions?.(row);
            const isLastRow = index === visibleRows.length - 1;

            return (
              <tr
                key={rowId}
                className={isSelected ? styles.selectedRow : undefined}
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
                    isLastRow={isLastRow}
                  />
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>

      <TablePagination
        page={page}
        pageCount={pageCount}
        rowsPerPage={rowsPerPage}
        selectedCount={selectedRows.length}
        pageSizeOptions={pageSizeOptions}
        onChangePage={setPage}
        onChangeRowsPerPage={changeRowsPerPage}
      />
    </div>
  );
}
