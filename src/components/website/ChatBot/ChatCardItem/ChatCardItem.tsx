"use client";

import React from "react";
import { TripCard, HotelCard, VehicleCard, type Vehicle } from "@/components/shared";
import type { Trip, Hotel } from "@/types";
import type { AssistantCard } from "@/lib/api";
import styles from "./ChatCardItem.module.scss";

interface ChatCardItemProps {
  card: AssistantCard;
  onCardClick?: () => void;
}

export default function ChatCardItem({ card, onCardClick }: ChatCardItemProps) {
  if (card.type === "trip") {
    const daysMatch = (card.title + " " + card.subtitle).match(/(\d+)\s*days?/i);
    const nightsMatch = (card.title + " " + card.subtitle).match(/(\d+)\s*nights?/i);
    const days = (card.duration_days !== undefined && card.duration_days !== null && card.duration_days > 0)
      ? card.duration_days
      : daysMatch ? parseInt(daysMatch[1], 10) : 1;
    const nights = (card.duration_nights !== undefined && card.duration_nights !== null)
      ? card.duration_nights
      : nightsMatch ? parseInt(nightsMatch[1], 10) : Math.max(0, days - 1);

    const tripObj: Trip = {
      id: card.slug || String(card.id),
      title: card.title,
      description: card.subtitle || "Explore our curated travel experiences",
      image: card.image || "/images/destination1.png",
      location: card.subtitle?.split("·")[0]?.trim() || "Egypt",
      price: parseFloat(card.price) || 0,
      currency: card.currency_code ? ` ${card.currency_code}` : "$",
      duration: {
        days,
        nights,
      },
      isFavorite: false,
    };

    return (
      <div className={styles.cardContainer} onClick={onCardClick}>
        <TripCard trip={tripObj} />
      </div>
    );
  }

  if (card.type === "hotel") {
    const hotelObj: Hotel = {
      id: card.slug || String(card.id),
      name: card.title,
      location: card.subtitle || "Egypt",
      image: card.image || "/images/hotel1.png",
      stars: 5,
      rating: parseFloat(card.rating) || 4.2,
      rooms: 245,
      pricePerNight: parseFloat(card.price) || 180,
      reviews: card.review_count || 1847,
      isFavorite: false,
    };

    return (
      <div className={styles.cardContainer} onClick={onCardClick}>
        <HotelCard hotel={hotelObj} />
      </div>
    );
  }

  if (card.type === "vehicle") {
    const vehicleObj: Vehicle = {
      id: card.slug || String(card.id),
      title: card.title,
      type: card.subtitle || "Private Transfer",
      image: card.image || "/images/sedan.png",
      passengers: 4,
      luggage: "2 Bags",
      rating: parseFloat(card.rating) || 4.8,
      reviews: card.review_count || 50,
      price: `${card.price || "150"} ${card.currency_code || "USD"}/day`,
    };

    return (
      <div className={styles.cardContainer} onClick={onCardClick}>
        <VehicleCard vehicle={vehicleObj} />
      </div>
    );
  }

  return null;
}
