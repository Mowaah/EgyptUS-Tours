import React from "react";
import Image from "next/image";
import styles from "./ViewTrip.module.scss";

interface RoomSelectionProps {
  selections: any[];
  booking?: any;
}

export default function RoomSelection({ selections, booking }: RoomSelectionProps) {
  if (!selections || selections.length === 0) return null;

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image src="/images/dashboard/booking/trips/view/room.svg" alt="" width={20} height={20} aria-hidden />
          </div>
          Room Selection
        </div>
      </div>

      <div className={styles.bookingInfoBox}>
        <div className={styles.boxTitle}>Type of Room</div>
        <div className={styles.roomBadgeList}>
          {selections.map((sel, idx) => {
            const roomTypeRaw =
              sel.room_type ||
              sel.type_label ||
              sel.room_name ||
              sel.name ||
              sel.category ||
              sel.room_category ||
              sel.hotel_room?.name ||
              sel.hotel_room?.type ||
              "";

            const roomTypeCapitalized = roomTypeRaw
              ? roomTypeRaw.charAt(0).toUpperCase() + roomTypeRaw.slice(1)
              : "";
            const roomTypeStr = roomTypeCapitalized.toLowerCase().endsWith("room")
              ? roomTypeCapitalized
              : roomTypeCapitalized
                ? `${roomTypeCapitalized} Room`
                : "Room";

            const lowerType = roomTypeRaw.toLowerCase();
            const icon = lowerType.includes("single")
              ? "single_room.svg"
              : lowerType.includes("triple")
                ? "triple_room.svg"
                : "double_room.svg";

            const count = sel.count ?? sel.quantity ?? 1;
            const viewLabel = sel.view_label || sel.view || sel.room_view || sel.hotel_room?.view || "";
            const label = [roomTypeStr, viewLabel].filter(Boolean).join(" - ") || `Room ${idx + 1}`;
            const title = count > 1 ? `${count}x ${label}` : label;

            const adultsCount =
              sel.adults ??
              sel.adult_count ??
              sel.adultCount ??
              (lowerType.includes("single")
                ? count * 1
                : lowerType.includes("double")
                  ? count * 2
                  : lowerType.includes("triple")
                    ? count * 3
                    : count);
            const adultPart = `${adultsCount} ${adultsCount === 1 ? "Adult" : "Adults"}`;

            // Resolve child occupants
            let childAges: (number | string)[] = [];
            if (Array.isArray(sel.children_ages) && sel.children_ages.length > 0) {
              childAges = sel.children_ages;
            } else if (Array.isArray(sel.children) && sel.children.length > 0) {
              childAges = sel.children
                .map((c: any) => (typeof c === "object" && c !== null ? c.age : c))
                .filter((a: any) => a !== undefined && a !== null);
            } else if (
              Array.isArray(booking?.child_room_pricing) &&
              booking.child_room_pricing.length > 0 &&
              Array.isArray(booking?.children_ages) &&
              booking.children_ages.length > 0
            ) {
              // Match children by child_room_pricing assignment
              const matchedAges: (number | string)[] = [];
              booking.child_room_pricing.forEach((assignment: string, cIdx: number) => {
                const assignLower = String(assignment || "").toLowerCase();
                const matchesType =
                  (lowerType.includes("single") && assignLower.includes("single")) ||
                  (lowerType.includes("double") && assignLower.includes("double")) ||
                  (lowerType.includes("triple") && assignLower.includes("triple"));
                const viewLower = viewLabel.toLowerCase();
                const matchesView = !viewLower || assignLower.includes(viewLower);

                if (matchesType && matchesView && booking.children_ages[cIdx] != null) {
                  matchedAges.push(booking.children_ages[cIdx]);
                }
              });
              if (matchedAges.length > 0) {
                childAges = matchedAges;
              }
            }

            // Fallback if not matched by specific child_room_pricing
            if (childAges.length === 0) {
              const allBookingAges = (booking?.children_ages || booking?.stay?.children_ages || [])
                .filter((a: any) => a !== undefined && a !== null && Number(a) > 0);
              if (allBookingAges.length > 0) {
                if (selections.length === 1 || idx === 0) {
                  childAges = allBookingAges;
                }
              }
            }

            const totalKidsCount =
              childAges.length > 0
                ? childAges.length
                : (selections.length === 1 || idx === 0)
                  ? Number(booking?.children ?? booking?.stay?.children ?? 0)
                  : 0;

            let childPart = "";
            if (childAges.length > 0) {
              const agesText = childAges.map((a: any) => `${a} years`).join(", ");
              childPart = `${childAges.length} ${childAges.length === 1 ? "Child" : "Children"} (${agesText})`;
            } else if (totalKidsCount > 0) {
              childPart = `${totalKidsCount} ${totalKidsCount === 1 ? "Child" : "Children"}`;
            }

            const subtitle = [adultPart, childPart].filter(Boolean).join(" · ");
            
            return (
              <div key={idx} className={styles.roomBadge}>
                <Image src={`/images/dashboard/booking/trips/view/${icon}`} alt="" width={20} height={20} />
                <div className={styles.roomBadgeText}>
                  <span className={styles.roomBadgeTitle}>{title}</span>
                  <span className={styles.roomBadgeSubtitle}>{subtitle}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
