"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { bookings } from "./dashboardHomeData";
import styles from "./DashboardHome.module.scss";

/** Builds a smart page list with ellipsis, e.g. [1, 2, 3, '...', 13, 14, 15] */
function buildPageList(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1, 2, 3];
  if (current > 4) pages.push("...");
  if (current > 3 && current < total - 2) pages.push(current);
  if (current < total - 3) pages.push("...");
  pages.push(total - 2, total - 1, total);

  // Deduplicate while preserving order
  return pages.filter((v, i, arr) => {
    if (v === "...") return true;
    return arr.indexOf(v) === i;
  });
}

export default function RecentBookingsTable() {
  const rows = useMemo(
    () =>
      Array.from({ length: 15 }, (_, index) => {
        const booking = bookings[index % bookings.length];
        const bookingNumber = 1284 - index;

        return {
          ...booking,
          id: `BK-${bookingNumber}`,
          status: index % 5 === 0 ? "Confirmed" : booking.status,
        };
      }),
    []
  );
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const pageCount = Math.ceil(rows.length / rowsPerPage);
  const visibleRows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const allVisibleSelected = visibleRows.every((booking) => selectedRows.includes(booking.id));
  const pageList = buildPageList(page, pageCount);

  const toggleRow = (id: string) => {
    setSelectedRows((current) =>
      current.includes(id) ? current.filter((rowId) => rowId !== id) : [...current, id]
    );
  };

  const toggleVisibleRows = () => {
    setSelectedRows((current) => {
      if (allVisibleSelected) {
        return current.filter((rowId) => !visibleRows.some((booking) => booking.id === rowId));
      }

      return Array.from(new Set([...current, ...visibleRows.map((booking) => booking.id)]));
    });
  };

  const changeRowsPerPage = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
    setOpenRow(null);
  };

  return (
    <div className={styles.tableWrap}>
      <table>
        <thead>
          <tr>
            <th aria-label="Select visible bookings"></th>
            <th>ID</th>
            <th>Customer</th>
            <th>Service</th>
            <th>Destination</th>
            <th>Date</th>
            <th>Price</th>
            <th>Status</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((booking) => (
            <tr
              className={selectedRows.includes(booking.id) ? styles.selectedRow : ""}
              key={`${booking.id}-${booking.customer}`}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(booking.id)}
                  onChange={() => toggleRow(booking.id)}
                  aria-label={`Select booking ${booking.id}`}
                />
              </td>
              <td className={styles.idCell}>{booking.id}</td>
              <td>{booking.customer}</td>
              <td>
                <span className={`${styles.servicePill} ${styles[booking.service.toLowerCase()]}`}>
                  {booking.service}
                </span>
              </td>
              <td>{booking.destination}</td>
              <td>{booking.date}</td>
              <td className={styles.priceCell}>
                <span className={styles.currencyIcon} aria-hidden>$</span>
                <span>{booking.price.replace(/^\$\s*/, "")}</span>
              </td>
              <td>
                <span className={`${styles.statusPill} ${styles[booking.status.toLowerCase()]}`}>
                  {booking.status}
                </span>
              </td>
              <td className={styles.moreCell}>
                <button
                  type="button"
                  className={styles.moreButton}
                  aria-expanded={openRow === booking.id}
                  aria-label={`More actions for ${booking.id}`}
                  onClick={() =>
                    setOpenRow((current) => (current === booking.id ? null : booking.id))
                  }
                >
                  <Image
                    src="/images/dashboard/dots.svg"
                    alt=""
                    width={20}
                    height={6}
                    aria-hidden
                  />
                </button>
                {openRow === booking.id ? (
                  <div className={styles.rowMenu}>
                    <button type="button">View details</button>
                    <button type="button">Send update</button>
                  </div>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ─── Footer ─── */}
      <div className={styles.tableFooter}>
        {/* Left: rows-per-page selector */}
        <div className={styles.footerLeft}>
          <div className={styles.selectWrapper}>
            <select
              className={styles.rowsSelect}
              value={rowsPerPage}
              onChange={(event) => changeRowsPerPage(Number(event.target.value))}
              aria-label="Rows per page"
            >
              {[5, 10, 15].map((value) => (
                <option value={value} key={value}>
                  {value}
                </option>
              ))}
            </select>
            <Image src="/images/dashboard/sidebar/chevron.svg" alt="" width={20} height={20} className={styles.selectChevron} aria-hidden />
          </div>
          <span className={styles.showLabel}>Show</span>
          {selectedRows.length > 0 ? (
            <span className={styles.selectionCount}>{selectedRows.length} selected</span>
          ) : null}
        </div>

        {/* Centre: pagination */}
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.paginationNav}
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            aria-label="Previous page"
          >
            <Image src="/images/dashboard/arrow-right.svg" alt="" width={16} height={16} className={styles.arrowLeft} />
            Previous
          </button>

          <div className={styles.pagesList}>
            {pageList.map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className={styles.pageEllipsis}>
                  ...
                </span>
              ) : (
                <button
                  type="button"
                  key={p}
                  className={p === page ? styles.pageActive : styles.pageBtn}
                  aria-current={p === page ? "page" : undefined}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            className={styles.paginationNav}
            disabled={page === pageCount}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            aria-label="Next page"
          >
            Next
            <Image src="/images/dashboard/arrow-right.svg" alt="" width={16} height={16} className={styles.arrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
}
