import type { PolicyId } from "./policyModalTypes";
import styles from "./ImportantLinksModal.module.scss";

const orangeHeading = styles.orangeHeading;
const inlineOrange = styles.inlineOrange;
const bodyText = styles.bodyText;
const termsLead = styles.termsLead;
const policyLine = styles.policyLine;
const policySection = styles.policySection;

export function PolicyModalBody({ id }: { id: PolicyId }) {
  switch (id) {
    case "terms":
      return (
        <div className={`${bodyText} ${policyLine}`}>
          <p className={termsLead}>
            <strong>Reservations:</strong> All bookings are subject to availability and confirmation. We reserve the right to refuse or cancel
            reservations that do not meet our requirements or when payment cannot be completed.
          </p>
          <p>
            <strong>Payments:</strong> Full or partial payment may be required depending on the package or hotel. Accepted methods and due
            dates will be stated in your booking confirmation.
          </p>
          <p>
            <strong>Cancellations &amp; Refunds:</strong> Cancellation policies vary by trip or hotel. Fees may apply according to the
            schedule in your confirmation. Refunds, when applicable, are processed using the original payment method unless otherwise agreed.
          </p>
          <p>
            <strong>Liability:</strong> We are not responsible for personal belongings, delays caused by third parties, force majeure events, or
            changes imposed by airlines, hotels, or local authorities.
          </p>
          <p>
            <strong>Code of Conduct:</strong> Guests are expected to respect hotel rules, local laws, and the safety instructions of guides and
            staff. We may remove participants from a tour if behavior endangers others or disrupts the group.
          </p>
          <p>
            <strong>Changes:</strong> Any modifications to bookings must be communicated promptly. Fees may apply for changes made after
            confirmation, subject to supplier policies.
          </p>
        </div>
      );

    case "children":
      return (
        <div className={`${bodyText} ${policyLine}`}>
          <div className={policySection}>
            <p>
              Children are warmly welcomed at our hotels and trips. Policies regarding age limits, extra beds, and meal options may vary
              depending on the hotel or tour selected.
            </p>
          </div>
          <p>
            <span className={inlineOrange}>Infants (0–2 years):</span> Generally stay free of charge; cribs may be available upon request.
          </p>
          <p>
            <span className={inlineOrange}>Children (3–11 years):</span> May incur a reduced rate for accommodation and meals.
          </p>
          <p>
            <span className={inlineOrange}>Teenagers (12–17 years):</span> Usually charged as adults for accommodation, but some tours may offer
            special pricing.
          </p>
        </div>
      );

    case "booking":
      return (
        <div className={bodyText}>
          <div className={policySection}>
            <p className={orangeHeading}>Payment Requirements</p>
            <div className={policyLine}>
              <p>
                To secure your booking, a deposit or full payment may be required depending on the selected trip or hotel.
              </p>
            </div>
          </div>
          <div className={policySection}>
            <p className={orangeHeading}>Confirmation Process</p>
            <div className={policyLine}>
              <p>
                Once your reservation is confirmed, you will receive an official confirmation email with all booking details, including dates,
                included services, and payment summary.
              </p>
            </div>
          </div>
          <div className={policySection}>
            <p className={orangeHeading}>Guest Information Accuracy</p>
            <div className={policyLine}>
              <p>
                Please ensure that all personal details provided during booking are accurate. Any special requests such as room preferences or
                dietary requirements should be mentioned at the time of reservation.
              </p>
            </div>
          </div>
        </div>
      );

    case "tipping":
      return (
        <div className={`${bodyText} ${policyLine}`}>
          <p>
            Tipping for a job well done is a common practice in Egypt, but it is always optional and at your discretion. If you feel satisfied
            with the service provided by your guide, driver, or cruise staff, offering a tip is a kind way to show appreciation, but it is never
            required or expected.
          </p>
          <p>
            Our team is committed to providing excellent service regardless of tipping, so please feel comfortable enjoying your trip without
            any obligation.
          </p>
        </div>
      );

    case "cancellation":
      return (
        <div className={bodyText}>
          <div className={policySection}>
            <p className={orangeHeading}>In case you cancel your trip</p>
            <div className={policyLine}>
              <p>
                From the date of booking until 61 days before your arrival date, 15% of the entire tour price will be charged. 35% of the tour
                price if you cancel 60–31 days before arrival. 50% of the tour price if you cancel 30–15 days before arrival. 100% of the tour
                price if you cancel 14–1 days before arrival. Additionally, airlines charge their fees which are subject to the airlines&apos;
                terms and conditions, and there&apos;s also a 5% bank fee on refunds. The cancellation policy may vary significantly for groups or
                unique itinerary.
              </p>
            </div>
          </div>
          <div className={policySection}>
            <p className={orangeHeading}>Force Majeure</p>
            <div className={policyLine}>
              <p>
                Here, at Memphis Tours, we prioritize your well-being and safety above all else and for that reason, we have adapted our
                cancellation policy to reflect our values. We offer a very flexible cancellation policy in case the government or the airline
                issues a NOT TO TRAVEL warning to the designated destination. In the event of this happening, we will refund you the amount paid
                for the tour package, or in some cases, your payment will be available as future travel credit and travel voucher that can be used
                towards any of the destinations we operate tours in. You have the flexibility to apply this amount towards new travel services
                booked. Reservations will be adjusted to reflect these travel credits automatically. Only flight cancellation/changing fees are
                charged, according to the airline&apos;s terms and conditions, and bank surcharges fees are applied to the deposit amount paid.
                Familiarize yourself with our full payment policy, cancellation and refund conditions.
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
