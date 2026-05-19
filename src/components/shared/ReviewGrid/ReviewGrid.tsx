"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/shared";
import styles from "./ReviewGrid.module.scss";

interface ReviewGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  pageSize?: number;
  gridClassName?: string;
}

export default function ReviewGrid<T>({ items, renderItem, pageSize = 6, gridClassName }: ReviewGridProps<T>) {
  const [visible, setVisible] = useState(pageSize);

  return (
    <div className={styles.reviewsWrap}>
      <div className={`${styles.grid} ${gridClassName || ''}`}>
        {items.slice(0, visible).map((item, index) => renderItem(item, index))}
      </div>

      {visible < items.length && (
        <>
          <div className={styles.loadMoreWrap}>
            <Button
              variant="outline"
              icon={
                <Image
                  src="/images/arrows/arrow-right-blue.svg"
                  alt=""
                  width={20}
                  height={20}
                  style={{ transform: "rotate(90deg)" }}
                />
              }
              iconPosition="right"
              onClick={() => setVisible((v) => v + pageSize)}
            >
              Load More
            </Button>
          </div>

          <div className={styles.fadeOverlay} />
        </>
      )}
    </div>
  );
}
