import Image from "next/image";
import { buildPageList } from "./buildPageList";
import styles from "./TablePagination.module.scss";

interface TablePaginationProps {
  page: number;
  pageCount: number;
  rowsPerPage: number;
  pageSizeOptions?: number[];
  className?: string;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (rows: number) => void;
}

const DEFAULT_PAGE_SIZES = [5, 10, 15];

export default function TablePagination({
  page,
  pageCount,
  rowsPerPage,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  className,
  onChangePage,
  onChangeRowsPerPage,
}: TablePaginationProps) {
  const safePage = Math.min(page, pageCount);
  const pageList = buildPageList(safePage, pageCount);

  return (
    <div className={`${styles.footer} ${className || ""}`.trim()}>
      <div className={styles.footerLeft}>
        <div className={styles.selectWrapper}>
          <select
            className={styles.rowsSelect}
            value={rowsPerPage}
            onChange={(event) => onChangeRowsPerPage(Number(event.target.value))}
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((value) => (
              <option value={value} key={value}>
                {value}
              </option>
            ))}
          </select>
          <Image
            src="/images/dashboard/sidebar/chevron.svg"
            alt=""
            width={20}
            height={20}
            className={styles.selectChevron}
            aria-hidden
          />
        </div>
        <span className={styles.showLabel}>Show</span>
      </div>

      <div className={styles.pagination}>
        <button
          type="button"
          className={styles.paginationNav}
          disabled={safePage === 1}
          onClick={() => onChangePage(Math.max(1, page - 1))}
          aria-label="Previous page"
        >
          <Image
            src="/images/dashboard/arrow-right.svg"
            alt=""
            width={16}
            height={16}
            className={styles.arrowLeft}
          />
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
                className={p === safePage ? styles.pageActive : styles.pageBtn}
                aria-current={p === safePage ? "page" : undefined}
                onClick={() => onChangePage(p)}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          className={styles.paginationNav}
          disabled={safePage === pageCount}
          onClick={() => onChangePage(Math.min(pageCount, page + 1))}
          aria-label="Next page"
        >
          Next
          <Image
            src="/images/dashboard/arrow-right.svg"
            alt=""
            width={16}
            height={16}
            aria-hidden
          />
        </button>
      </div>
    </div>
  );
}
