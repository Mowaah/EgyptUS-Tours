"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ReviewModal from "./ReviewModal";

export default function ReviewModalHandler() {
  const searchParams = useSearchParams();
  const [activeToken, setActiveToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token") || searchParams.get("review_token");
    if (tokenParam) {
      setActiveToken(tokenParam);
    }
  }, [searchParams]);

  const handleClose = () => {
    setActiveToken(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      url.searchParams.delete("review_token");
      window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
    }
  };

  if (!activeToken) return null;

  return <ReviewModal token={activeToken} onClose={handleClose} />;
}
