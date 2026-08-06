"use client";

import Image from "next/image";
import { useVehicleDetailContext } from "../layout";
import styles from "./page.module.scss";

export default function TransportationPricingPage() {
  const { vehicle, loading } = useVehicleDetailContext();

  if (loading) return <div>Loading pricing...</div>;
  if (!vehicle) return <div>Vehicle not found.</div>;

  const basePrice = vehicle.price_amount !== null ? `$${vehicle.price_amount}` : "-";
  const vat = vehicle.vat_amount !== null ? `$${vehicle.vat_amount}` : "-";
  const insurance = vehicle.insurance_fee !== null ? `$${vehicle.insurance_fee}` : "-";
  const pricePerKm = vehicle.price_per_km !== null ? `$${vehicle.price_per_km}` : "-";
  
  let totalPrice = 0;
  if (vehicle.price_amount) totalPrice += Number(vehicle.price_amount);
  if (vehicle.vat_amount) totalPrice += Number(vehicle.vat_amount);
  if (vehicle.insurance_fee) totalPrice += Number(vehicle.insurance_fee);
  
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
            { label: "VAT", value: vat },
            { label: "Insurance", value: insurance },
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
          <span className={styles.totalValue}>${totalPrice}</span>
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
                <span className={styles.cellValue}>{service.price ? `$${service.price}` : "-"}</span>
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
