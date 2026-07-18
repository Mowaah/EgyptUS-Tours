export interface B2BItem {
  id: string;
  ref: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  country: string;
  submittedOn: string;
  source: string;
  status: string;
  agent: string;
}

export const mockB2BData: B2BItem[] = [
  { id: "1", ref: "#B2B-001", companyName: "Pharaoh Travel LLC", contactName: "Ahmed Zaki", contactEmail: "ahmed@niletours.com", country: "Egypt...", submittedOn: "Apr 10, 2026 • 12:30 PM...", source: "Website", status: "New", agent: "Unassigned" },
  { id: "2", ref: "#B2B-001", companyName: "Pharaoh Travel LLC", contactName: "Ahmed Zaki", contactEmail: "ahmed@niletours.com", country: "Dubai", submittedOn: "Apr 10, 2026 • 12:30 PM...", source: "Agent", status: "In Progress", agent: "Sara M." },
  { id: "3", ref: "#B2B-001", companyName: "Pharaoh Travel LLC", contactName: "Ahmed Zaki", contactEmail: "ahmed@niletours.com", country: "Egypt...", submittedOn: "Apr 10, 2026 • 12:30 PM...", source: "Website", status: "Proposal Ready", agent: "Sara M." },
  { id: "4", ref: "#B2B-001", companyName: "Pharaoh Travel LLC", contactName: "Ahmed Zaki", contactEmail: "ahmed@niletours.com", country: "Dubai", submittedOn: "Apr 10, 2026 • 12:30 PM...", source: "Agent", status: "Proposal Sent", agent: "Sara M." },
  { id: "5", ref: "#B2B-001", companyName: "Pharaoh Travel LLC", contactName: "Ahmed Zaki", contactEmail: "ahmed@niletours.com", country: "Egypt...", submittedOn: "Apr 10, 2026 • 12:30 PM...", source: "Website", status: "Rejected", agent: "Sara M." },
  { id: "6", ref: "#B2B-001", companyName: "Pharaoh Travel LLC", contactName: "Ahmed Zaki", contactEmail: "ahmed@niletours.com", country: "Dubai", submittedOn: "Apr 10, 2026 • 12:30 PM...", source: "Website", status: "Negotiation", agent: "Sara M." },
  { id: "7", ref: "#B2B-001", companyName: "Pharaoh Travel LLC", contactName: "Ahmed Zaki", contactEmail: "ahmed@niletours.com", country: "Egypt...", submittedOn: "Apr 10, 2026 • 12:30 PM...", source: "Website", status: "30% Pending Payment", agent: "Sara M." },
  { id: "8", ref: "#B2B-001", companyName: "Pharaoh Travel LLC", contactName: "Ahmed Zaki", contactEmail: "ahmed@niletours.com", country: "Dubai", submittedOn: "Apr 10, 2026 • 12:30 PM...", source: "Website", status: "Deposit Paid", agent: "Sara M." },
  { id: "9", ref: "#B2B-001", companyName: "Pharaoh Travel LLC", contactName: "Ahmed Zaki", contactEmail: "ahmed@niletours.com", country: "Egypt...", submittedOn: "Apr 10, 2026 • 12:30 PM...", source: "Website", status: "Fully Paid", agent: "Sara M." },
  { id: "10", ref: "#B2B-001", companyName: "Pharaoh Travel LLC", contactName: "Ahmed Zaki", contactEmail: "ahmed@niletours.com", country: "Dubai", submittedOn: "Apr 10, 2026 • 12:30 PM...", source: "Website", status: "In Trip", agent: "Sara M...." },
  { id: "11", ref: "#B2B-001", companyName: "Pharaoh Travel LLC", contactName: "Ahmed Zaki", contactEmail: "ahmed@niletours.com", country: "Egypt...", submittedOn: "Apr 10, 2026 • 12:30 PM...", source: "Website", status: "Completed", agent: "Sara M." },
  { id: "12", ref: "#B2B-001", companyName: "Pharaoh Travel LLC", contactName: "Ahmed Zaki", contactEmail: "ahmed@niletours.com", country: "Dubai", submittedOn: "Apr 10, 2026 • 12:30 PM...", source: "Website", status: "Cancelled", agent: "Sara M." },
  { id: "13", ref: "#B2B-001", companyName: "Pharaoh Travel LLC", contactName: "Ahmed Zaki", contactEmail: "ahmed@niletours.com", country: "Egypt...", submittedOn: "Apr 10, 2026 • 12:30 PM...", source: "Website", status: "Refund Completed", agent: "Sara M." },
];

export const getB2BDetails = (id: string) => {
  const summary = mockB2BData.find((t) => t.id === id) || mockB2BData[0];
  return {
    id: summary.ref,
    applicantName: "Ahmed Hassan",
    requestNumber: "B2B-001",
    date: "April 10, 2025 at 1:20 PM",
    status: summary.status,
    companyInfo: {
      companyName: "Nile Horizon Events",
      country: "Egypt",
      contactPerson: "Ahmed Hassan",
      jobTitle: "Operations Manager",
      email: "ahmed.hassan@nilehorizonevents.com",
      phone: "+20 109 458 7721",
      website: "www.nilehorizonevents.com",
      requestDetails: "We are looking for a complete tourism management solution to manage bookings, customer inquiries, transportation services, and partner coordination more efficiently.",
    }
  };
};
