"use client";

import { use } from "react";
import PromotionDetails from "@/components/dashboard/Promotions/PromotionDetails/PromotionDetails";
import styles from "../../../page.module.scss";

export default function PromotionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);

  return (
    <>
      
      
        <PromotionDetails promotionId={unwrappedParams.id} />
      
    </>
  );
}
