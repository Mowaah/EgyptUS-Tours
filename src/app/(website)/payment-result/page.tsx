"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function isPaymobSuccess(params: URLSearchParams): boolean {
  const successVal = (params.get("success") || "").toLowerCase();
  const isSuccess = successVal === "true" || successVal === "1" || successVal === "yes";

  const errorOccuredVal = (params.get("error_occured") || "").toLowerCase();
  const hasError = errorOccuredVal === "true" || errorOccuredVal === "1" || errorOccuredVal === "yes";

  const txnCode = (params.get("txn_response_code") || "").toUpperCase();
  const isApprovedCode =
    !txnCode ||
    txnCode === "APPROVED" ||
    txnCode === "00" ||
    txnCode === "0" ||
    txnCode === "200" ||
    txnCode === "SUCCESS";

  const isPending = (params.get("pending") || "").toLowerCase() === "true";

  if (params.get("booking_success") === "true" || params.get("booking_success") === "1") {
    return true;
  }

  return isSuccess && !hasError && isApprovedCode && !isPending;
}

function sanitizeSlug(slug: string | null): string | null {
  if (!slug) return null;
  const cleaned = slug.trim().toLowerCase();
  return /^[a-z0-9-_]+$/.test(cleaned) ? cleaned : null;
}

function sanitizeId(id: string | null): string {
  if (!id) return "";
  return id.replace(/[^a-zA-Z0-9-_]/g, "");
}

function PaymentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = isPaymobSuccess(urlParams);

    let savedHotelSlug: string | null = null;
    let savedTripSlug: string | null = null;
    let isGroupTrip = false;
    let savedBookingId: string | null = null;
    let targetType: "hotel" | "trip" | null = null;

    try {
      const tripStored = localStorage.getItem("last_trip_booking") || sessionStorage.getItem("last_trip_booking");
      const hotelStored = localStorage.getItem("last_hotel_booking") || sessionStorage.getItem("last_hotel_booking");

      const tripParsed = tripStored ? JSON.parse(tripStored) : null;
      const hotelParsed = hotelStored ? JSON.parse(hotelStored) : null;

      const tripTime = Number(tripParsed?.timestamp || 0);
      const hotelTime = Number(hotelParsed?.timestamp || 0);

      const now = Date.now();
      const tripValid = tripTime && now - tripTime < 2 * 60 * 60 * 1000;
      const hotelValid = hotelTime && now - hotelTime < 2 * 60 * 60 * 1000;

      if (tripValid && (!hotelValid || tripTime >= hotelTime)) {
        targetType = "trip";
        savedTripSlug = sanitizeSlug(tripParsed.tripSlug);
        isGroupTrip = Boolean(tripParsed.isGroupTrip);
        savedBookingId = tripParsed.id ? sanitizeId(String(tripParsed.id)) : null;
      } else if (hotelValid) {
        targetType = "hotel";
        savedHotelSlug = sanitizeSlug(hotelParsed.hotelSlug);
        savedBookingId = hotelParsed.id ? sanitizeId(String(hotelParsed.id)) : null;
      }
    } catch (e) {
      console.error("Failed to read booking info from storage", e);
    }

    const bookingIdParam = savedBookingId || sanitizeId(urlParams.get("id") || urlParams.get("order") || "");

    if (targetType === "trip" && savedTripSlug) {
      const bookPath = isGroupTrip ? "book-group" : "book-private";
      if (success) {
        router.replace(`/trips/${savedTripSlug}/${bookPath}?booking_success=true&booking_id=${bookingIdParam}`);
      } else {
        router.replace(`/trips/${savedTripSlug}/${bookPath}?payment_failed=true`);
      }
    } else if (targetType === "hotel" && savedHotelSlug) {
      if (success) {
        router.replace(`/hotels/${savedHotelSlug}/book?booking_success=true&booking_id=${bookingIdParam}`);
      } else {
        router.replace(`/hotels/${savedHotelSlug}/book?payment_failed=true`);
      }
    } else {
      if (success) {
        const amountCents = urlParams.get("amount_cents");
        const merchantOrderId = urlParams.get("merchant_order_id");
        
        let extraParams = "";
        if (amountCents) extraParams += `&amount_cents=${amountCents}`;
        if (merchantOrderId) {
          // Extract just the PAY-YYYY-XXXX part, stripping our added random UUID
          const cleanRef = merchantOrderId.split("-").slice(0, 3).join("-");
          extraParams += `&ref=${cleanRef}`;
        }
        
        router.replace(`/profile?booking_success=true&booking_id=${bookingIdParam}${extraParams}`);
      } else {
        router.replace("/egypttours");
      }
    }
  }, [router, searchParams]);

  return (
    <main
      style={{
        minHeight: "60vh",
        padding: "120px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "18px", color: "var(--text-color, #4b5563)" }}>
        Processing your booking confirmation...
      </div>
    </main>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "60vh",
            padding: "120px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: "18px", color: "var(--text-color, #4b5563)" }}>
            Processing payment result...
          </div>
        </main>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
