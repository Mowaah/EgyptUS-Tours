"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "../Button/Button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";
import { MultiCurrencyPrice } from "@/constants/currency";
import styles from "./VehicleCard.module.scss";

export interface Vehicle {
  id: string;
  title: string;
  type?: string;
  description?: string;
  image: string;
  passengers: number;
  luggage: string;
  durationHours?: string;
  features?: string[]; // e.g. ["WIFI", "Water Bottles", "Air Conditioning"]
  rating: number;
  reviews: number;
  price: string;
  prices?: MultiCurrencyPrice;
  originalPrice?: number;
  originalPrices?: MultiCurrencyPrice;
  discountTitle?: string;
  discountValue?: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  view?: "grid" | "list";
}

export default function VehicleCard({ vehicle, view = "grid" }: VehicleCardProps) {
  const { t } = useTranslation("common");
  const { formatCurrency } = useCurrency();
  const isList = view === "list";
  const vehicleDetailsHref = `/transportation/${vehicle.id}`;

  const formatDuration = (val?: string) => {
    if (!val) return "";
    const clean = val.replace(/^(\d+)-\1$/, "$1");
    return `${clean} ${clean === "1" ? t("units.hour", "hour") : t("units.hours", "hours")}`;
  };

  const formatLuggage = (luggage: string) => {
    if (!luggage) return "";
    const match = luggage.match(/^(\d+)\s*large suitcase/i);
    if (match) {
      const count = parseInt(match[1], 10);
      return count === 1
        ? t("units.largeSuitcase", "{count} large suitcase").replace("{count}", "1")
        : t("units.largeSuitcases", "{count} large suitcases").replace("{count}", String(count));
    }
    return luggage;
  };

  return (
    <div className={`${styles.card} ${isList ? styles.listCard : ""}`}>
      <Link href={vehicleDetailsHref} className={`${styles.imageArea} ${isList ? styles.listImageArea : ""}`}>
        <Image
          src={vehicle.image || "/images/sedan.png"}
          alt={vehicle.title || "Vehicle Image"}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {(vehicle.discountTitle || vehicle.discountValue) && (
          <div className={styles.discountBanner}>
            <span>{vehicle.discountTitle || vehicle.discountValue}</span>
          </div>
        )}
      </Link>

      <div className={`${styles.content} ${isList ? styles.listContent : ""}`}>
        <Link href={vehicleDetailsHref} className={`${styles.header} ${isList ? styles.listHeader : ""}`}>
          <div className={styles.titleWrapper}>
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{vehicle.title}</h3>
              <div className={styles.badge}>
                <Image src="/images/profile2-orange.svg" alt="" width={12} height={12} />
                <span>1-{vehicle.passengers}</span>
              </div>
            </div>
            {vehicle.description && <p className={styles.description}>{vehicle.description}</p>}
          </div>
          <div className={`${styles.rating} ${isList ? styles.listRating : ""}`}>
            <Image src="/images/star-yellow3.svg" alt="" width={12} height={12} />
            <span>{vehicle.rating}</span>
          </div>
        </Link>

        <div className={`${styles.specs} ${isList ? styles.listSpecs : ""}`}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>{t("units.passengers", "Passengers")}</span>
            <span className={styles.specValue}>
              {vehicle.passengers} {vehicle.passengers === 1 ? t("units.seat", "seat") : t("units.seats", "seats")}
            </span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>{t("units.luggage", "Luggage")}</span>
            <span className={styles.specValue}>{formatLuggage(vehicle.luggage)}</span>
          </div>
          {vehicle.durationHours && (
            <div className={styles.specItem}>
              <span className={styles.specLabel}>{t("units.duration", "Duration")}</span>
              <span className={styles.specValue}>{formatDuration(vehicle.durationHours)}</span>
            </div>
          )}
        </div>

        <div className={styles.features}>
          {(vehicle.features || []).map((feature, idx) => (
            <div key={idx} className={styles.featureTag}>
              <Image src="/images/summary/checkmark-green.svg" alt="" width={14} height={14} />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className={`${styles.footerWrapper} ${isList ? styles.listFooterWrapper : ""}`}>
          <div className={styles.footer}>
            <div className={styles.priceCol}>
              <span className={styles.priceLabel}>{t("units.totalPrice", "Total Price")}</span>
              <span className={styles.priceValue}>
                {vehicle.originalPrice && (
                  <span className={styles.originalPrice}>{formatCurrency(vehicle.originalPrices || vehicle.originalPrice)}</span>
                )}
                {formatCurrency(vehicle.prices || Number(String(vehicle.price).replace(/,/g, "")) || 0)}
              </span>
            </div>
            <Button variant="primary" size="sm" href={`/transportation/${vehicle.id}/book`}>
              {t("units.bookNow", "Book Now")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
