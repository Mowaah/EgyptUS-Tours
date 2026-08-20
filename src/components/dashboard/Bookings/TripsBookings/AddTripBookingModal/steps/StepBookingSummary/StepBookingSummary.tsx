import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./StepBookingSummary.module.scss";
import { AddTripBookingData } from "../../AddTripBookingModal";
import { previewTripBooking } from "@/services/admin/adminBookingsService";

interface StepBookingSummaryProps {
  formData?: AddTripBookingData;
  previewData?: any;
  setPreviewData?: (data: any) => void;
}

export default function StepBookingSummary({ formData, previewData: propPreviewData, setPreviewData: propSetPreviewData }: StepBookingSummaryProps) {
  const [localPreviewData, setLocalPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activePreview = propPreviewData || localPreviewData;

  const formatDateToYMD = (dateString?: string) => {
    if (!dateString) return null;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (!formData || !formData.tripId) return;

    let isMounted = true;
    setLoading(true);
    setError("");

    const getRoomCount = (key: string) => {
      if (!formData.rooms) return 0;
      let count = 0;
      const lowerKey = key.toLowerCase();
      for (const [k, v] of Object.entries(formData.rooms)) {
        if (k.toLowerCase().includes(lowerKey)) {
          count += (v as number) || 0;
        }
      }
      return count;
    };

    const singleCount = getRoomCount("Single");
    const doubleCount = getRoomCount("Double");
    const tripleCount = getRoomCount("Triple");

    // Fallback: if all zero, calculate total from roomCustomizations
    const totalCustomizedRooms = Object.values(formData.roomCustomizations || {}).reduce((sum, ids) => sum + ids.length, 0);
    const resolvedSingle = (singleCount > 0 || doubleCount > 0 || tripleCount > 0) ? singleCount : (totalCustomizedRooms || 1);

    const payload = {
      trip_id: parseInt(formData.tripId, 10),
      tour_type: formData.tourType || "private",
      full_name: formData.guestName || "Guest",
      email: formData.guestEmail || "guest@example.com",
      phone: formData.guestPhone || "0000000000",
      nationality: formData.guestNationality || "US",
      adults: formData.adults || 1,
      children: formData.children || 0,
      infants: formData.infants || 0,
      start_date: formData.tourType === "private" ? formatDateToYMD(formData.startDate) : null,
      end_date: formData.tourType === "private" ? formatDateToYMD(formData.endDate) : null,
      availability_slot_id: formData.tourType === "group" && formData.departureDateId ? parseInt(formData.departureDateId, 10) : null,
      rooms_single: resolvedSingle,
      rooms_double: doubleCount,
      rooms_triple: tripleCount,
    };

    previewTripBooking(payload)
      .then((res) => {
        if (isMounted) {
          const data = res.data || res;
          setLocalPreviewData(data);
          if (propSetPreviewData) propSetPreviewData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError("Failed to load booking summary from server.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [formData, propSetPreviewData]);

  const numGuests = formData ? (formData.adults + formData.children + formData.infants) || 1 : 1;
  const numRooms = formData
    ? Object.values(formData.roomCustomizations || {}).reduce((sum, ids) => sum + ids.length, 0) || 1
    : 1;

  const tripName = activePreview?.trip_title || activePreview?.trip_name || "Trip";

  let nights = 0;
  if (formData && formData.startDate && formData.endDate) {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }
  const days = nights + 1;

  const lineItems: any[] = activePreview?.line_items || activePreview?.price_breakdown?.line_items || activePreview?.items || [];
  const total = activePreview?.total_price || activePreview?.price_breakdown?.total || activePreview?.total || 0;
  const discount = activePreview?.discount || activePreview?.price_breakdown?.discount || 0;
  const vat = activePreview?.vat || activePreview?.price_breakdown?.vat || 0;

  return (
    <div className={styles.container}>
      {/* Left Panel: Trip Details */}
      <div className={`${styles.panel} ${styles.leftPanel}`}>
        <div className={styles.leftInner}>
          <div className={styles.titleWrap}>
            <h3 className={styles.tripTitle}>{tripName}</h3>
          </div>

          <div className={styles.middleSection}>
            <div className={styles.staySection}>
              <span className={styles.stayLabel}>Your Trip</span>

              <div className={styles.datesRow}>
                {/* Start Date */}
                <div className={styles.dateItem}>
                  <div className={styles.dateHeader}>
                    <Image src="/images/summary/clock.svg" alt="" width={24} height={24} />
                    <span>Start Date</span>
                  </div>
                  <div className={styles.dateValuesWrap}>
                    <div className={styles.dateValues}>
                      <span className={styles.dateDay}>{formData?.startDate ? new Date(formData.startDate).toLocaleDateString("en-GB", { month: "2-digit", day: "2-digit", year: "numeric" }) : "TBD"}</span>
                    </div>
                  </div>
                </div>

                {/* End Date */}
                <div className={styles.dateItem}>
                  <div className={styles.dateHeader}>
                    <Image src="/images/summary/clock.svg" alt="" width={24} height={24} />
                    <span>End Date</span>
                  </div>
                  <div className={styles.dateValuesWrap}>
                    <div className={styles.dateValues}>
                      <span className={styles.dateDay}>{formData?.endDate ? new Date(formData.endDate).toLocaleDateString("en-GB", { month: "2-digit", day: "2-digit", year: "numeric" }) : "TBD"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.badgesRow}>
              <div className={styles.badge}>
                <Image src="/images/night.svg" alt="" width={16} height={16} />
                <span>{days} Days / {nights} Nights</span>
              </div>
              <div className={styles.badge}>
                <Image src="/images/room.svg" alt="" width={16} height={16} />
                <span>{numRooms} Room{numRooms !== 1 ? "s" : ""}</span>
              </div>
              <div className={styles.badge}>
                <Image src="/images/summary/adults.svg" alt="" width={16} height={16} />
                <span>{numGuests} Guest{numGuests !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Price Details */}
      <div className={`${styles.panel} ${styles.rightPanel}`}>
        <div className={styles.rightInner}>
          <div className={styles.priceListSection}>
            <div className={styles.priceTitleWrap}>
              <span className={styles.priceTitle}>Price Details</span>
            </div>

            {loading ? (
              <div style={{ padding: "20px 0", textAlign: "center", color: "#666" }}>Loading pricing...</div>
            ) : error ? (
              <div style={{ padding: "20px 0", textAlign: "center", color: "red" }}>{error}</div>
            ) : (
              <>
                <div className={styles.priceItemsContainer}>
                  {lineItems.map((item: any, idx: number) => {
                    const roomType = item.room_type ? (item.room_type.charAt(0).toUpperCase() + item.room_type.slice(1)) : "";
                    const label = item.description || (roomType ? `${roomType} Room${item.view_label ? ` - ${item.view_label}` : ""}` : "Room");
                    const price = item.line_total || item.total || item.unit_price || 0;
                    return (
                      <div key={idx} className={styles.priceRow}>
                        <span className={styles.priceLabel}>
                          {item.quantity > 1 ? `${item.quantity} × ` : ""}{label}
                        </span>
                        <span className={styles.priceValue}>${parseFloat(price).toFixed(2)}</span>
                      </div>
                    );
                  })}

                  {parseFloat(discount) > 0 && (
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>Special Discount</span>
                      <span className={styles.discountValue}>-${parseFloat(discount).toFixed(2)}</span>
                    </div>
                  )}

                  {parseFloat(vat) > 0 && (
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>VAT</span>
                      <span className={styles.priceValue}>${parseFloat(vat).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total (USD)</span>
                  <span className={styles.totalValue}>${parseFloat(total).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
