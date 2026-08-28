import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./StepBookingSummary.module.scss";
import { AddTripBookingData } from "../../AddTripBookingModal";
import { previewTripBooking } from "@/services/admin/adminBookingsService";
import { getFullHotelBySlug } from "@/services/hotelsService";
import useSWR from "swr";

interface StepBookingSummaryProps {
  formData?: AddTripBookingData;
  previewData?: any;
  setPreviewData?: (data: any) => void;
  tripDetail?: any;
}

export default function StepBookingSummary({ formData, previewData: propPreviewData, setPreviewData: propSetPreviewData, tripDetail }: StepBookingSummaryProps) {
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

    let nights = 1;
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      }
    }

    const roomSelections: Array<{ room_type: "single" | "double" | "triple"; view_label: string; quantity: number; unit_price: number }> = [];
    if (formData.roomCustomizations) {
      const baseSeason = tripDetail?.seasonPricing?.[0] || { single: 0, double: 0, triple: 0 };
      const roomMap: Record<string, { room_type: "single" | "double" | "triple"; view_label: string; quantity: number; unit_price: number }> = {};

      for (const [type, optionsList] of Object.entries(formData.roomCustomizations)) {
        const rawType = type.toLowerCase();
        let basePrice = 0;
        let mappedType: "single" | "double" | "triple" = "double";
        if (rawType.includes("single")) {
          basePrice = baseSeason.single;
          mappedType = "single";
        } else if (rawType.includes("triple")) {
          basePrice = baseSeason.triple;
          mappedType = "triple";
        } else {
          basePrice = baseSeason.double;
          mappedType = "double";
        }

        for (const opt of (optionsList as string[])) {
          let viewLabel = "Garden View";
          if (opt === "pool") {
            viewLabel = "Pool View";
          } else if (opt === "sea") {
            viewLabel = "Sea View";
          }

          const key = `${mappedType}_${viewLabel}`;
          if (!roomMap[key]) {
            roomMap[key] = {
              room_type: mappedType,
              view_label: viewLabel,
              quantity: 0,
              unit_price: basePrice
            };
          }
          roomMap[key].quantity += 1;
        }
      }
      roomSelections.push(...Object.values(roomMap));
    }

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
      start_date: formatDateToYMD(formData.startDate),
      end_date: formatDateToYMD(formData.endDate),
      availability_slot_id: formData.departureDateId ? (parseInt(formData.departureDateId, 10) || null) : null,
      rooms_single: resolvedSingle,
      rooms_double: doubleCount,
      rooms_triple: tripleCount,
      room_selections: roomSelections.length > 0 ? roomSelections : undefined,
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
  let total = parseFloat(activePreview?.total_price || activePreview?.price_breakdown?.total || activePreview?.total || 0);
  const discount = activePreview?.discount || activePreview?.price_breakdown?.discount || 0;



  const formatPrice = (price: number | string) => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(num)) return "£0";
    return `£${num.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  };

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
                          {item.quantity > 1 ? `${item.quantity}x ` : ""}{label}
                        </span>
                        <span className={styles.priceValue}>{formatPrice(price)}</span>
                      </div>
                    );
                  })}

                  {parseFloat(discount) > 0 && (
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>Special Discount</span>
                      <span className={styles.discountValue}>-{formatPrice(discount)}</span>
                    </div>
                  )}

                </div>

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total (EGP)</span>
                  <span className={styles.totalValue}>{formatPrice(total)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
