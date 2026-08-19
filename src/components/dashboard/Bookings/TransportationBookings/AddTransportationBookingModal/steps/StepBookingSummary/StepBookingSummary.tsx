import React from "react";
import Image from "next/image";
import useSWR from "swr";
import { AddTransportationBookingData } from "../../AddTransportationBookingModal";
import { previewTransportationBooking } from "@/services/admin/adminBookingsService";
import styles from "./StepBookingSummary.module.scss";

interface StepBookingSummaryProps {
  formData: AddTransportationBookingData;
}

const fetchPreview = async (url: string, payload: any) => {
  return await previewTransportationBooking(payload);
};

export default function StepBookingSummary({ formData }: StepBookingSummaryProps) {
  const formatDateToYMD = (dateString: string) => {
    if (!dateString) return dateString;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return null;
    if (!timeStr.toLowerCase().includes("m")) {
      return timeStr.includes(":") ? timeStr : null;
    }
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3].toUpperCase();
    if (period === "AM" && hours === 12) hours = 0;
    if (period === "PM" && hours < 12) hours += 12;
    return `${String(hours).padStart(2, "0")}:${minutes}:00`;
  };

  const payload = {
    vehicle_id: formData.vehicleId,
    distance_km: parseFloat(formData.distanceKm) || 0,
    trip_type: formData.tripType,
    full_name: formData.guestName,
    email: formData.guestEmail,
    phone: `${formData.guestPhonePrefix}${formData.guestPhone}`,
    nationality: formData.guestNationality,
    pickup_location: formData.pickupLocation,
    dropoff_location: formData.dropoffLocation,
    pickup_date: formatDateToYMD(formData.pickupDate),
    pickup_time: formatTime(formData.pickupTime),
    passengers: formData.passengers,
    luggage: formData.luggage,
    additional_service_ids: formData.additionalServiceIds,
    special_requests: formData.specialRequests,
  };

  const { data: previewData, isLoading } = useSWR(
    formData.vehicleId && formData.pickupDate ? ["/bookings/transportation/preview", payload] : null,
    ([url, payload]) => fetchPreview(url, payload)
  );

  const preview = previewData?.data || {};
  const basePrice = preview.base_price || 0;
  const servicesTotal = preview.additional_services_price || 0;
  const subtotal = preview.subtotal || 0;
  const vat = preview.vat_amount || 0;
  const insurance = preview.insurance_fee || 0;
  const discount = preview.discount_amount || 0;
  const total = preview.total_price || 0;
  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading pricing preview...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Left Panel: Booking Summary */}
      <div className={styles.panel}>
        <div className={styles.leftInner}>
          <div className={styles.titleWrap}>
            <h3 className={styles.tripTitle}>Booking Summary</h3>
            <div className={styles.ratingBadge}>
              <Image src="/images/star-yellow.svg" alt="Rating" width={18} height={18} />
              <span className={styles.ratingValue}>4.9</span>
              <span className={styles.ratingCount}>(248)</span>
            </div>
          </div>

          <div className={styles.carImageWrap}>
            <Image 
              src="/images/sedan.png" 
              alt="Transportation Vehicle" 
              width={273} 
              height={178} 
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>

      {/* Right Panel: Price Details */}
      <div className={styles.panel}>
        <div className={styles.rightInner}>
          <div className={styles.priceTitleWrap}>
            <span className={styles.priceTitle}>Price Details</span>
          </div>
          
          <div className={styles.priceItemsContainer}>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>
                Base Vehicle Price ({formData.tripType.replace("_", " ")})
              </span>
              <span className={styles.priceValue}>${basePrice.toFixed(2)}</span>
            </div>
            
            {servicesTotal > 0 && (
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Additional Services</span>
                <span className={styles.priceValue}>${servicesTotal.toFixed(2)}</span>
              </div>
            )}
            
            {discount > 0 && (
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Special Discount</span>
                <span className={styles.discountValue}>-${discount.toFixed(2)}</span>
              </div>
            )}
            
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>VAT</span>
              <span className={styles.priceValue}>${vat.toFixed(2)}</span>
            </div>

            {insurance > 0 && (
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Insurance Fee</span>
                <span className={styles.priceValue}>${insurance.toFixed(2)}</span>
              </div>
            )}
          </div>
        
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
