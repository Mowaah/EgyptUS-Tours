"use client";

import { useEffect, useState } from "react";
import DashboardStatusBanner, { DashboardStatusBannerVariant } from "../DashboardStatusBanner/DashboardStatusBanner";

export interface DashboardToastEventDetail {
  message: string;
  variant: DashboardStatusBannerVariant;
  durationMs?: number;
}

export const triggerToast = (message: string, variant: DashboardStatusBannerVariant = "error", durationMs?: number) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("dashboard-toast", {
        detail: { message, variant, durationMs },
      })
    );
  } else {
    alert(message);
  }
};

export default function GlobalToastContainer() {
  const [toast, setToast] = useState<DashboardToastEventDetail | null>(null);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<DashboardToastEventDetail>;
      setToast(customEvent.detail);
    };

    window.addEventListener("dashboard-toast", handleToastEvent);
    return () => {
      window.removeEventListener("dashboard-toast", handleToastEvent);
    };
  }, []);

  if (!toast) return null;

  return (
    <div style={{ position: "fixed", top: 0, right: 0, zIndex: 9999 }}>
      <DashboardStatusBanner
        show={true}
        message={toast.message}
        variant={toast.variant}
        durationMs={toast.durationMs || 5000}
        onClose={() => setToast(null)}
        // We override the absolute positioning from the module to fit the fixed container
        className="global-toast-banner"
      />
      <style jsx global>{`
        .global-toast-banner {
          position: fixed !important;
          top: 12rem !important;
          right: 2rem !important;
        }
        @media (max-width: 980px) {
          .global-toast-banner {
            right: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
