export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  subsections?: {
    title: string;
    content: string;
  }[];
}

export const TERMS_DATA: { title: string; subtitle: string; sections: LegalSection[] } = {
  title: "Terms and conditions",
  subtitle: "Please read carefully to understand your rights, responsibilities, and the rules of using our services.",
  sections: [
    {
      id: "general-terms",
      title: "General Terms",
      paragraphs: [
        "All users of this website agree to comply with the following general terms and conditions. By accessing or using the site, you accept full responsibility for your actions. Bookings made through the website are subject to availability, and the information provided on the site is for informational purposes only. Prices, services, and schedules may change without prior notice due to seasonal demand, special offers, or unforeseen circumstances. Users are responsible for ensuring the accuracy of the information they provide and for following all instructions during the booking and payment process.",
        "The website owner reserves the right to suspend, modify, or terminate access to the platform at any time, with or without notice. Any unauthorized use of the website, including attempts to copy, reproduce, or exploit content, is strictly prohibited."
      ]
    },
    {
      id: "user-responsibilities",
      title: "User Responsibilities",
      paragraphs: [
        "The website and its owners are not liable for personal belongings, accidents, injuries, or events outside our control during your travel, stay, or interactions with services booked through the site. Users are encouraged to obtain appropriate travel insurance to cover unforeseen events.",
        "Guests are expected to follow hotel, trip, and service provider rules and respect staff and other travelers. Misbehavior, fraudulent activity, or violations of local laws may result in denial of service or cancellation of bookings without refund.",
        "Any changes, modifications, or cancellations must be communicated promptly. Additional charges may apply depending on the type of modification or service. By using this website, you agree to comply with all applicable local laws and accept that the governing law for any disputes will be [insert country/jurisdiction]."
      ]
    }
  ]
};

export const PRIVACY_DATA: { title: string; subtitle: string; sections: LegalSection[] } = {
  title: "Privacy and Policy",
  subtitle: "Learn how we collect, use, and protect your personal information to ensure your privacy and security.",
  sections: [
    {
      id: "children-policy",
      title: "Children Policy",
      paragraphs: [
        "Children are warmly welcomed at our hotels and trips. Policies regarding age limits, extra beds, and meal options may vary depending on the hotel or tour selected."
      ],
      subsections: [
        {
          title: "Infants (0–2 years):",
          content: "Generally stay free of charge; cribs may be available upon request."
        },
        {
          title: "Children (3–11 years):",
          content: "May incur a reduced rate for accommodation and meals."
        },
        {
          title: "Teenagers (12–17 years):",
          content: "Usually charged as adults for accommodation, but some tours may offer special pricing."
        }
      ]
    },
    {
      id: "booking-policy",
      title: "Booking Policy",
      paragraphs: [],
      subsections: [
        {
          title: "Payment Requirements",
          content: "To secure your booking, a deposit or full payment may be required depending on the selected trip or hotel."
        },
        {
          title: "Confirmation Process",
          content: "Once your reservation is confirmed, you will receive an official confirmation email with all booking details, including dates, included services, and payment summary."
        },
        {
          title: "Guest Information Accuracy",
          content: "Please ensure that all personal details provided during booking are accurate. Any special requests such as room preferences or dietary requirements should be mentioned at the time of reservation."
        }
      ]
    },
    {
      id: "tipping",
      title: "Tipping",
      paragraphs: [
        "Tipping for a job well done is a common practice in Egypt, but it is always optional and at your discretion. If you feel satisfied with the service provided by your guide, driver, or cruise staff, offering a tip is a kind way to show appreciation, but it is never required or expected.",
        "Our team is committed to providing excellent service regardless of tipping, so please feel comfortable enjoying your trip without any obligation."
      ]
    },
    {
      id: "cancellation-policy",
      title: "Cancellation Policy",
      paragraphs: [],
      subsections: [
        {
          title: "In case you cancel your trip",
          content: "From the date of booking until 61 days before your arrival date, 15% of the entire tour price will be charged.\n35% of the tour price if you cancel 60-31 days before arrival.\n50% of the tour price if you cancel 30-15 days before arrival.\n100% of the tour price if you cancel 14-1 days before arrival.\nAdditionally, airlines charge their fees which are subject to the airlines' terms and conditions, and bank surcharges fees are applied to the deposit amount paid. Familiarize yourself with our full payment policy, cancellation and refund conditions. The cancellation policy may vary significantly for groups or unique itinerary."
        },
        {
          title: "Force Majeure",
          content: "Here, at EgyptUS Tours, we prioritize your well-being and safety above all else and for that reason, we have adapted our cancellation policy to reflect our values. We offer a very flexible cancellation policy in case the government or the airline issues a NOT TO TRAVEL warning to the designated destination. In the event of this happening, we will refund you the amount paid for the tour package, or in some cases, your payment will be available as future travel credit and travel voucher that can be used towards any of the destinations we operate tours in. You have the flexibility to apply this amount towards new travel services booked. Reservations will be adjusted to reflect these travel credits automatically. Only flight cancellation/changing fees are charged, according to the airline's terms and conditions, and bank surcharges fees are applied to the deposit amount paid. Familiarize yourself with our full payment policy, cancellation and refund conditions."
        }
      ]
    }
  ]
};
