"use client";

import type { PolicyId } from "./policyModalTypes";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./ImportantLinksModal.module.scss";

const orangeHeading = styles.orangeHeading;
const inlineOrange = styles.inlineOrange;
const bodyText = styles.bodyText;
const termsLead = styles.termsLead;
const policyLine = styles.policyLine;
const policySection = styles.policySection;

export function PolicyModalBody({ id }: { id: PolicyId }) {
  const { t } = useTranslation("legal");

  switch (id) {
    case "terms":
      return (
        <div className={`${bodyText} ${policyLine}`}>
          <p className={termsLead}>
            <strong>{t("body.terms.reservationsLabel", "Reservations:")}</strong>{" "}
            {t(
              "body.terms.reservationsText",
              "All bookings are subject to availability and confirmation. We reserve the right to refuse or cancel reservations that do not meet our requirements or when payment cannot be completed."
            )}
          </p>
          <p>
            <strong>{t("body.terms.paymentsLabel", "Payments:")}</strong>{" "}
            {t(
              "body.terms.paymentsText",
              "Full or partial payment may be required depending on the package or hotel. Accepted methods and due dates will be stated in your booking confirmation."
            )}
          </p>
          <p>
            <strong>{t("body.terms.cancellationsLabel", "Cancellations & Refunds:")}</strong>{" "}
            {t(
              "body.terms.cancellationsText",
              "Cancellation policies vary by trip or hotel. Fees may apply according to the schedule in your confirmation. Refunds, when applicable, are processed using the original payment method unless otherwise agreed."
            )}
          </p>
          <p>
            <strong>{t("body.terms.liabilityLabel", "Liability:")}</strong>{" "}
            {t(
              "body.terms.liabilityText",
              "We are not responsible for personal belongings, delays caused by third parties, force majeure events, or changes imposed by airlines, hotels, or local authorities."
            )}
          </p>
          <p>
            <strong>{t("body.terms.codeOfConductLabel", "Code of Conduct:")}</strong>{" "}
            {t(
              "body.terms.codeOfConductText",
              "Guests are expected to respect hotel rules, local laws, and the safety instructions of guides and staff. We may remove participants from a tour if behavior endangers others or disrupts the group."
            )}
          </p>
          <p>
            <strong>{t("body.terms.changesLabel", "Changes:")}</strong>{" "}
            {t(
              "body.terms.changesText",
              "Any modifications to bookings must be communicated promptly. Fees may apply for changes made after confirmation, subject to supplier policies."
            )}
          </p>
        </div>
      );

    case "children":
      return (
        <div className={`${bodyText} ${policyLine}`}>
          <div className={policySection}>
            <p>
              {t(
                "body.children.intro",
                "Children are warmly welcomed at our hotels and trips. Policies regarding age limits, extra beds, and meal options may vary depending on the hotel or tour selected."
              )}
            </p>
          </div>
          <p>
            <span className={inlineOrange}>
              {t("body.children.infantsTitle", "Infants (0–2 years):")}
            </span>{" "}
            {t(
              "body.children.infantsText",
              "Generally stay free of charge; cribs may be available upon request."
            )}
          </p>
          <p>
            <span className={inlineOrange}>
              {t("body.children.childrenTitle", "Children (3–11 years):")}
            </span>{" "}
            {t(
              "body.children.childrenText",
              "May incur a reduced rate for accommodation and meals."
            )}
          </p>
          <p>
            <span className={inlineOrange}>
              {t("body.children.teenagersTitle", "Teenagers (12–17 years):")}
            </span>{" "}
            {t(
              "body.children.teenagersText",
              "Usually charged as adults for accommodation, but some tours may offer special pricing."
            )}
          </p>
        </div>
      );

    case "booking":
      return (
        <div className={bodyText}>
          <div className={policySection}>
            <p className={orangeHeading}>
              {t("body.booking.paymentRequirementsHeading", "Payment Requirements")}
            </p>
            <div className={policyLine}>
              <p>
                {t(
                  "body.booking.paymentRequirementsText",
                  "To secure your booking, a deposit or full payment may be required depending on the selected trip or hotel."
                )}
              </p>
            </div>
          </div>
          <div className={policySection}>
            <p className={orangeHeading}>
              {t("body.booking.confirmationProcessHeading", "Confirmation Process")}
            </p>
            <div className={policyLine}>
              <p>
                {t(
                  "body.booking.confirmationProcessText",
                  "Once your reservation is confirmed, you will receive an official confirmation email with all booking details, including dates, included services, and payment summary."
                )}
              </p>
            </div>
          </div>
          <div className={policySection}>
            <p className={orangeHeading}>
              {t("body.booking.guestInfoHeading", "Guest Information Accuracy")}
            </p>
            <div className={policyLine}>
              <p>
                {t(
                  "body.booking.guestInfoText",
                  "Please ensure that all personal details provided during booking are accurate. Any special requests such as room preferences or dietary requirements should be mentioned at the time of reservation."
                )}
              </p>
            </div>
          </div>
        </div>
      );

    case "tipping":
      return (
        <div className={`${bodyText} ${policyLine}`}>
          <p>
            {t(
              "body.tipping.paragraph1",
              "Tipping for a job well done is a common practice in Egypt, but it is always optional and at your discretion. If you feel satisfied with the service provided by your guide, driver, or cruise staff, offering a tip is a kind way to show appreciation, but it is never required or expected."
            )}
          </p>
          <p>
            {t(
              "body.tipping.paragraph2",
              "Our team is committed to providing excellent service regardless of tipping, so please feel comfortable enjoying your trip without any obligation."
            )}
          </p>
        </div>
      );

    case "cancellation":
      return (
        <div className={bodyText}>
          <div className={policySection}>
            <p className={orangeHeading}>
              {t("body.cancellation.cancelHeading", "In case you cancel your trip")}
            </p>
            <div className={policyLine}>
              <p>
                {t(
                  "body.cancellation.cancelText",
                  "From the date of booking until 61 days before your arrival date, 15% of the entire tour price will be charged. 35% of the tour price if you cancel 60–31 days before arrival. 50% of the tour price if you cancel 30–15 days before arrival. 100% of the tour price if you cancel 14–1 days before arrival. Additionally, airlines charge their fees which are subject to the airlines' terms and conditions, and there's also a 5% bank fee on refunds. The cancellation policy may vary significantly for groups or unique itinerary."
                )}
              </p>
            </div>
          </div>
          <div className={policySection}>
            <p className={orangeHeading}>
              {t("body.cancellation.forceMajeureHeading", "Force Majeure")}
            </p>
            <div className={policyLine}>
              <p>
                {t(
                  "body.cancellation.forceMajeureText",
                  "We prioritize your well-being and safety above all else and for that reason, we have adapted our cancellation policy to reflect our values. We offer a very flexible cancellation policy in case the government or the airline issues a NOT TO TRAVEL warning to the designated destination. In the event of this happening, we will refund you the amount paid for the tour package, or in some cases, your payment will be available as future travel credit and travel voucher that can be used towards any of the destinations we operate tours in. You have the flexibility to apply this amount towards new travel services booked. Reservations will be adjusted to reflect these travel credits automatically. Only flight cancellation/changing fees are charged, according to the airline's terms and conditions, and bank surcharges fees are applied to the deposit amount paid. Familiarize yourself with our full payment policy, cancellation and refund conditions."
                )}
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
