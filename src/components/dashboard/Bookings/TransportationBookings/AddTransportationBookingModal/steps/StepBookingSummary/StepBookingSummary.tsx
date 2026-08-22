import React from "react";
import Image from "next/image";
import useSWR from "swr";
import { AddTransportationBookingData } from "../../AddTransportationBookingModal";
import { previewTransportationBooking } from "@/services/admin/adminBookingsService";
import { apiClient } from "@/lib/api";
import styles from "./StepBookingSummary.module.scss";

interface StepBookingSummaryProps {
  formData: AddTransportationBookingData;
}

const fetchPreview = async (payload: any) => {
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

  // 1. Fetch public vehicle detail for actual car rating, image, and base price fallback
  const { data: vehicleData } = useSWR(
    formData.vehicleId ? `/vehicles/${formData.vehicleId}/` : null,
    (url) => apiClient.get(url)
  );
  const vehicle = (vehicleData as any) || {};

  // 2. Fetch backend preview pricing
  const payload = {
    vehicle_id: formData.vehicleId,
    distance_km: parseFloat(formData.distanceKm) || 0,
    trip_type: formData.tripType || "one_way",
    full_name: formData.guestName || "Guest",
    email: formData.guestEmail || "guest@example.com",
    phone: `${formData.guestPhonePrefix || "+1"}${formData.guestPhone || "000000000"}`,
    nationality: formData.guestNationality || "US",
    pickup_location: formData.pickupLocation || "Pickup",
    dropoff_location: formData.dropoffLocation || "Dropoff",
    pickup_date: formatDateToYMD(formData.pickupDate) || new Date().toISOString().split("T")[0],
    pickup_time: formatTime(formData.pickupTime) || "12:00:00",
    passengers: formData.passengers || 1,
    luggage: formData.luggage || "0",
    additional_service_ids: formData.additionalServiceIds || [],
    special_requests: formData.specialRequests || "",
  };

  const { data: previewData, isLoading } = useSWR(
    formData.vehicleId ? ["/bookings/transportation/preview/", payload] : null,
    ([, p]) => fetchPreview(p)
  );

  const preview = previewData?.data || previewData || {};
  const priceBreakdown = preview.price_breakdown || {};

  // Base price
  const basePrice =
    parseFloat(priceBreakdown.base_price ?? preview.base_price ?? (vehicle.price_amount || vehicle.price || 0)) || 0;

  // Selected additional services
  const additionalServicesList = vehicle.additional_services || [];
  const selectedAddons = additionalServicesList.filter((s: any) =>
    formData.additionalServiceIds?.includes(s.id)
  );
  const fallbackServicesTotal = selectedAddons.reduce(
    (acc: number, s: any) => acc + (parseFloat(s.price) || 0),
    0
  );

  const servicesTotal =
    parseFloat(
      priceBreakdown.services_total ??
      preview.additional_services_price ??
      fallbackServicesTotal
    ) || 0;

  const discount = parseFloat(preview.discount ?? priceBreakdown.discount ?? preview.discount_amount ?? 0) || 0;
  const total =
    parseFloat(
      preview.total_price ??
      priceBreakdown.total ??
      (basePrice + servicesTotal - discount)
    ) || 0;

  const rating = vehicle.rating || vehicle.rating_avg || vehicle.average_rating || "5.0";
  const carImage = vehicle.image || vehicle.hero_image || "/images/sedan.png";

  if (isLoading && !vehicleData) {
    return <div className={styles.loadingContainer}>Loading pricing preview...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Left Panel: Booking Summary */}
      <div className={styles.panel}>
        <div className={styles.leftInner}>
          <div className={styles.titleWrap}>
            <h3 className={styles.tripTitle}>{vehicle.name || "Booking Summary"}</h3>
            <div className={styles.ratingBadge}>
              <Image src="/images/star-yellow.svg" alt="Rating" width={18} height={18} />
              <span className={styles.ratingValue}>{rating}</span>
            </div>
          </div>

          <div className={styles.carImageWrap}>
            <Image 
              src={carImage} 
              alt={vehicle.name || "Transportation Vehicle"} 
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
            
            {selectedAddons.length > 0 ? (
              selectedAddons.map((addon: any) => (
                <div className={styles.priceRow} key={addon.id}>
                  <span className={styles.priceLabel}>{addon.name}</span>
                  <span className={styles.priceValue}>+${(parseFloat(addon.price) || 0).toFixed(2)}</span>
                </div>
              ))
            ) : servicesTotal > 0 ? (
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Additional Services</span>
                <span className={styles.priceValue}>+${servicesTotal.toFixed(2)}</span>
              </div>
            ) : null}
            
            {discount > 0 && (
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Special Discount</span>
                <span className={styles.discountValue}>-${discount.toFixed(2)}</span>
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
