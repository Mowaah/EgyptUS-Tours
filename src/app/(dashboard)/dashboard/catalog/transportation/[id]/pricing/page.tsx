"use client";

import Image from "next/image";
import { DASHBOARD_CURRENCY, formatPrice } from "@/constants/currency";
import { useVehicleDetailContext } from "../layout";
import styles from "./page.module.scss";

export default function TransportationPricingPage() {
  const { vehicle, loading } = useVehicleDetailContext();

  if (loading) return <div>Loading pricing...</div>;
  if (!vehicle) return <div>Vehicle not found.</div>;

  const basePrice = formatPrice(vehicle.price_amount);
  const pricePerKm = formatPrice(vehicle.price_per_km);
  
  const totalPrice = vehicle.price_amount ? Number(vehicle.price_amount) : 0;
  
  const additionalServices = vehicle.additional_services || [];

  return (
    <div className={styles.wrapper}>
      {/* General Pricing */}
      <div className={styles.section}>
        <div className={styles.titleRow}>
          <div className={styles.iconWrap}>
            <Image src="/images/dashboard/catalog/trips/pricing.svg" alt="" width={20} height={20} />
          </div>
          <h2>General Pricing</h2>
        </div>

        <div className={styles.priceGrid}>
          {[
            { label: "Base Price", value: basePrice },
            { label: "Price Per KM", value: pricePerKm },
          ].map((item) => (
            <div key={item.label} className={styles.priceCell}>
              <span className={styles.cellLabel}>{item.label}</span>
              <span className={styles.cellValue}>{item.value}</span>
            </div>
          ))}
        </div>

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Total Price</span>
          <span className={styles.totalValue}>{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Additional Services */}
      <div className={styles.section}>
        <div className={styles.titleRow}>
          <div className={styles.iconWrap}>
            <Image src="/images/dashboard/catalog/trips/pricing.svg" alt="" width={20} height={20} />
          </div>
          <h2>Additional Services</h2>
        </div>

        {additionalServices.length > 0 ? (
          <div className={styles.priceGrid}>
            {additionalServices.map((service: any) => (
              <div key={service.name || service} className={styles.priceCell}>
                <span className={styles.cellLabel}>{service.name || service}</span>
                <span className={styles.cellValue}>{service.price ? formatPrice(service.price) : "-"}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.priceCell}>
            <span className={styles.cellLabel}>No additional services added.</span>
          </div>
        )}
      </div>
    </div>
  );
}
