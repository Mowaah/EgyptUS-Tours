import Image from "next/image";
import styles from "./ViewTrip.module.scss";

interface BookingInformationProps {
  booking: any;
}

function formatDateString(dateStr: string) {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function BookingInformation({ booking }: BookingInformationProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image src="/images/dashboard/booking/trips/view/booking.svg" alt="" width={20} height={20} aria-hidden />
          </div>
          Booking Information
        </div>
      </div>

      <div className={styles.bookingInfoWrapper}>
        <div className={styles.bookingInfoBox}>
          <div className={styles.boxTitle}>Trip Time</div>
          <div className={styles.dateRow}>
            <div className={styles.dateBlock}>
              <div className={styles.dateTopRow}>
                <Image src="/images/dashboard/booking/trips/view/date.svg" alt="" width={24} height={24} />
                <span className={styles.dateLabel}>{booking?.check_in_date ? "Check-in Date" : "Start Date"}</span>
              </div>
              <div className={styles.dateBottomRow}>
                <span className={styles.dateValue}>{formatDateString(booking?.start_date || booking?.check_in_date)}</span>
              </div>
            </div>
            
            <div className={styles.dateBlock}>
              <div className={styles.dateTopRow}>
                <Image src="/images/dashboard/booking/trips/view/date.svg" alt="" width={24} height={24} />
                <span className={styles.dateLabel}>{booking?.check_out_date ? "Check-out Date" : "End Date"}</span>
              </div>
              <div className={styles.dateBottomRow}>
                <span className={styles.dateValue}>{formatDateString(booking?.end_date || booking?.check_out_date)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bookingInfoBox}>
          <div className={styles.boxTitle}>Pax Distribution</div>
          <div className={styles.paxDistributionList}>
            {booking?.adults > 0 && (
              <span className={styles.nationalityBadge}>
                <Image src="/images/dashboard/booking/trips/view/adults.svg" alt="" width={16} height={16} />
                {booking.adults} {booking.adults === 1 ? "Adult" : "Adults"}
              </span>
            )}
            {booking?.children > 0 && (
              <span className={styles.nationalityBadge}>
                <Image src="/images/dashboard/booking/trips/view/children.svg" alt="" width={16} height={16} />
                {booking.children} {booking.children === 1 ? "Child" : "Children"}
              </span>
            )}
            {booking?.infants > 0 && (
              <span className={styles.nationalityBadge}>
                <Image src="/images/dashboard/booking/trips/view/infants.svg" alt="" width={16} height={16} />
                {booking.infants} {booking.infants === 1 ? "Infant" : "Infants"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
