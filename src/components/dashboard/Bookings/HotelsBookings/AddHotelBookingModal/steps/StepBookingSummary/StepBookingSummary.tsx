import React, { useEffect, useState } from "react";
import Image from "next/image";
import RatingBadge from "@/components/shared/RatingBadge/RatingBadge";
import styles from "./StepBookingSummary.module.scss";
import { AddHotelBookingData } from "../../AddHotelBookingModal";
import { previewHotelBooking } from "@/services/admin/adminBookingsService";

interface StepBookingSummaryProps {
  formData?: AddHotelBookingData;
  onSummaryLoad?: (data: any) => void;
}

export default function StepBookingSummary({ formData, onSummaryLoad }: StepBookingSummaryProps) {
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatDateToYMD = (dateString: string) => {
    if (!dateString) return dateString;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (!formData || !formData.specificHotel) return;
    
    let isMounted = true;
    setLoading(true);
    
    let room_selections: { hotel_room_id: number; quantity: number }[] = [];
    if (formData.roomCustomizations) {
      Object.values(formData.roomCustomizations).forEach(roomIds => {
        roomIds.forEach(id => {
          const parsedId = parseInt(id);
          if (isNaN(parsedId)) return;
          const existing = room_selections.find(s => s.hotel_room_id === parsedId);
          if (existing) {
            existing.quantity += 1;
          } else {
            room_selections.push({ hotel_room_id: parsedId, quantity: 1 });
          }
        });
      });
    }

    const payload = {
      hotel_id: parseInt(formData.specificHotel),
      check_in_date: formatDateToYMD(formData.checkInDate),
      check_out_date: formatDateToYMD(formData.checkOutDate),
      room_selections
    };
    
    previewHotelBooking(payload).then((res) => {
      if (isMounted) {
        const data = res.data || res;
        setPreviewData(data);
        if (onSummaryLoad) onSummaryLoad(data);
        setLoading(false);
      }
    }).catch((err) => {
      if (isMounted) {
        console.error(err);
        setError("Failed to load booking summary from server.");
        setLoading(false);
      }
    });
    
    return () => { isMounted = false; };
  }, [formData]);

  const numGuests = formData ? (formData.adults + formData.infants + formData.children) || 2 : 2;
  const numRooms = formData?.roomCustomizations ? Object.values(formData.roomCustomizations).reduce((acc, ids) => acc + ids.length, 0) : 0;
  
  const hotelName = previewData?.hotel_name || formData?.hotelLocation || "Selected Hotel";
  const nights = previewData?.nights || 0;
  
  const subtotal = previewData?.subtotal || "0.00";
  const discount = previewData?.discount || "0.00";
  const vat = previewData?.vat || "0.00";
  const total = previewData?.total_price || "0.00";
  const lineItems = previewData?.line_items || [];

  return (
    <div className={styles.container}>
      {/* Left Panel: Hotel Details */}
      <div className={`${styles.panel} ${styles.leftPanel}`}>
        <div className={styles.leftInner}>
          <div className={styles.titleWrap}>
            <h3 className={styles.tripTitle}>{hotelName}</h3>
            <RatingBadge rating={4.9} reviews={248} size="md" className={styles.ratingBadge} />
          </div>

          <div className={styles.middleSection}>
          <div className={styles.staySection}>
            <span className={styles.stayLabel}>Your Stay</span>
            
            <div className={styles.datesRow}>
              {/* Check-in */}
              <div className={styles.dateItem}>
                <div className={styles.dateHeader}>
                  <Image src="/images/summary/clock.svg" alt="" width={24} height={24} />
                  <span>Check-in</span>
                </div>
                <div className={styles.dateValuesWrap}>
                  <div className={styles.dateValues}>
                    <span className={styles.dateDay}>{formData?.checkInDate ? new Date(formData.checkInDate).toLocaleDateString("en-GB", { weekday: 'short', month: 'short', day: 'numeric' }) : "Sun, Mar 15"}</span>
                    <span className={styles.dateTime}>From 15:00</span>
                  </div>
                </div>
              </div>

              {/* Check-Out */}
              <div className={styles.dateItem}>
                <div className={styles.dateHeader}>
                  <Image src="/images/summary/clock.svg" alt="" width={24} height={24} />
                  <span>Check-Out</span>
                </div>
                <div className={styles.dateValuesWrap}>
                  <div className={styles.dateValues}>
                    <span className={styles.dateDay}>{formData?.checkOutDate ? new Date(formData.checkOutDate).toLocaleDateString("en-GB", { weekday: 'short', month: 'short', day: 'numeric' }) : "Sun, Mar 15"}</span>
                    <span className={styles.dateTime}>From 15:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.badgesRow}>
            <div className={styles.badge}>
              <Image src="/images/night.svg" alt="" width={16} height={16} />
              <span>{nights} Night{nights !== 1 && 's'}</span>
            </div>
            <div className={styles.badge}>
              <Image src="/images/room.svg" alt="" width={16} height={16} />
              <span>{numRooms} Room{numRooms !== 1 && 's'}</span>
            </div>
            <div className={styles.badge}>
              <Image src="/images/summary/adults.svg" alt="" width={16} height={16} />
              <span>{numGuests} Guest{numGuests !== 1 && 's'}</span>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Price Details */}
      <div className={`${styles.panel} ${styles.rightPanel}`}>
        <div className={styles.rightInner}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Loading pricing...</div>
          ) : error ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#C11515' }}>{error}</div>
          ) : (
            <div className={styles.priceListSection}>
              <div className={styles.priceTitleWrap}>
                <span className={styles.priceTitle}>Price Details</span>
              </div>
              
              <div className={styles.priceItemsContainer}>
                {lineItems.map((item: any, idx: number) => (
                  <div key={idx} className={styles.priceRow}>
                    <span className={styles.priceLabel}>
                      {item.quantity} × {item.type_label} - {item.view_label} ({nights} {nights === 1 ? 'night' : 'nights'})
                    </span>
                    <span className={styles.priceValue}>${item.line_total}</span>
                  </div>
                ))}
                
                {parseFloat(discount) > 0 && (
                  <div className={styles.priceRow}>
                    <span className={styles.priceLabel}>Special Discount</span>
                    <span className={styles.discountValue}>-${discount}</span>
                  </div>
                )}
                
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>VAT</span>
                  <span className={styles.priceValue}>${vat}</span>
                </div>
              </div>
            
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>${total}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
