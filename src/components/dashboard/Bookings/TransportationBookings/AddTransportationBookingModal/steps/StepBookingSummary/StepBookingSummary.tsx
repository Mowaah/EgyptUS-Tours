import React from "react";
import Image from "next/image";
import { AddTransportationBookingData } from "../../AddTransportationBookingModal";
import styles from "./StepBookingSummary.module.scss";

interface StepBookingSummaryProps {
  formData: AddTransportationBookingData;
}

export default function StepBookingSummary({ formData }: StepBookingSummaryProps) {
  // Calculate dynamic prices
  const getVehicleBasePrice = (type: string) => {
    switch (type) {
      case "SUV": return 80;
      case "Van": return 120;
      case "Bus": return 200;
      case "Sedan":
      default: return 50;
    }
  };

  const basePrice = getVehicleBasePrice(formData.vehicleType);
  const tripMultiplier = formData.tripType === "Round Trip" ? 2 : 1;
  const vehicleTotal = basePrice * tripMultiplier;
  
  const childSeatPrice = 10;
  const extraLuggagePrice = 15;
  const meetAndGreetPrice = 20;
  
  let subtotal = vehicleTotal;
  if (formData.childSeat) subtotal += childSeatPrice;
  if (formData.extraLuggageSpace) subtotal += extraLuggagePrice;
  if (formData.meetAndGreetService) subtotal += meetAndGreetPrice;
  
  const discount = 5;
  const vat = subtotal * 0.10; // 10% VAT
  const total = subtotal - discount + vat;

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
                {tripMultiplier} × {formData.vehicleType || "Sedan"} Vehicle 
                {formData.tripType === "Round Trip" ? " (Round Trip)" : ""}
              </span>
              <span className={styles.priceValue}>${vehicleTotal.toFixed(2)}</span>
            </div>
            
            {formData.childSeat && (
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Child Seat</span>
                <span className={styles.priceValue}>${childSeatPrice.toFixed(2)}</span>
              </div>
            )}
            
            {formData.extraLuggageSpace && (
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Extra Luggage Space</span>
                <span className={styles.priceValue}>${extraLuggagePrice.toFixed(2)}</span>
              </div>
            )}

            {formData.meetAndGreetService && (
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Meet & Greet Service</span>
                <span className={styles.priceValue}>${meetAndGreetPrice.toFixed(2)}</span>
              </div>
            )}
            
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Special Discount</span>
              <span className={styles.discountValue}>-${discount.toFixed(2)}</span>
            </div>
            
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>VAT (10%)</span>
              <span className={styles.priceValue}>${vat.toFixed(2)}</span>
            </div>
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
