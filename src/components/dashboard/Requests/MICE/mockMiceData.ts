export interface MiceItem {
  id: string;
  ref: string;
  organizationName: string;
  industry: string;
  email: string;
  submittedOn: string;
  source: string;
  status: string;
  agent: string;
}

export const mockMiceData: MiceItem[] = [
  { id: "1", ref: "#MCE-002", organizationName: "ACME Corp", industry: "Technology", email: "jen@email.com ...", submittedOn: "Apr 10, 2026 • 12:30 PM", source: "Website", status: "New", agent: "------" },
  { id: "2", ref: "#MCE-002", organizationName: "ACME Corp", industry: "Technology", email: "jen@email.com ...", submittedOn: "Apr 10, 2026 • 12:30 PM", source: "Agent", status: "In Progress", agent: "Sara M." },
  { id: "3", ref: "#MCE-002", organizationName: "ACME Corp", industry: "Healthcare", email: "jen@email.com ...", submittedOn: "Apr 10, 2026 • 12:30 PM", source: "Website", status: "Proposal Ready", agent: "Sara M." },
  { id: "4", ref: "#MCE-002", organizationName: "ACME Corp", industry: "Finance", email: "jen@email.com ...", submittedOn: "Apr 10, 2026 • 12:30 PM", source: "Agent", status: "Proposal Sent", agent: "Sara M." },
  { id: "5", ref: "#MCE-002", organizationName: "ACME Corp", industry: "Healthcare", email: "jen@email.com ...", submittedOn: "Apr 10, 2026 • 12:30 PM", source: "Website", status: "Rejected", agent: "Sara M." },
  { id: "6", ref: "#MCE-002", organizationName: "ACME Corp", industry: "Technology", email: "jen@email.com ...", submittedOn: "Apr 10, 2026 • 12:30 PM", source: "Website", status: "Negotiation", agent: "Sara M." },
  { id: "7", ref: "#MCE-002", organizationName: "ACME Corp", industry: "Finance", email: "jen@email.com ...", submittedOn: "Apr 10, 2026 • 12:30 PM", source: "Website", status: "30% Pending Payment", agent: "Sara M." },
  { id: "8", ref: "#MCE-002", organizationName: "ACME Corp", industry: "Healthcare", email: "jen@email.com ...", submittedOn: "Apr 10, 2026 • 12:30 PM", source: "Website", status: "Deposit Paid", agent: "Sara M." },
  { id: "9", ref: "#MCE-002", organizationName: "ACME Corp", industry: "Technology", email: "jen@email.com ...", submittedOn: "Apr 10, 2026 • 12:30 PM", source: "Website", status: "Fully Paid", agent: "Unassigned" },
  { id: "10", ref: "#MCE-002", organizationName: "ACME Corp", industry: "Finance", email: "jen@email.com ...", submittedOn: "Apr 10, 2026 • 12:30 PM", source: "Website", status: "In Trip", agent: "Unassigned..." },
  { id: "11", ref: "#MCE-002", organizationName: "ACME Corp", industry: "Technology", email: "jen@email.com ...", submittedOn: "Apr 10, 2026 • 12:30 PM", source: "Website", status: "Completed", agent: "Sara M." },
  { id: "12", ref: "#MCE-002", organizationName: "ACME Corp", industry: "Healthcare", email: "jen@email.com ...", submittedOn: "Apr 10, 2026 • 12:30 PM", source: "Website", status: "Cancelled", agent: "Sara M." },
  { id: "13", ref: "#MCE-002", organizationName: "ACME Corp", industry: "Healthcare", email: "jen@email.com ...", submittedOn: "Apr 10, 2026 • 12:30 PM", source: "Website", status: "Refund Completed", agent: "Sara M." },
];

export const getMiceDetails = (id: string) => {
  return {
    id,
    applicantName: "Ahmed Hassan",
    requestNumber: "CTP-002",
    date: "April 10, 2025 at 1:20 PM",
    status: "New",
    organization: {
      organizationName: "Nile Horizon Events",
      industry: "Tourism & Event Management",
      country: "Egypt",
      website: "www.nilehorizonevents.com",
      contactPerson: "Ahmed Hassan",
      jobTitle: "Event Operations Manager",
      email: "ahmed.hassan@nilehorizonevents.com",
      phone: "+20 109 458 7721",
    },
    eventDetails: {
      eventType: "Corporate Conference",
      eventName: "Future Vision Summit 2026",
      expectedAttendees: "350",
      preferredCity: "Dubai",
      startDate: "15 June 2026",
      endDate: "15 June 2026",
      eventDescription: "A three-day business and networking event focused on innovation, technology, and strategic partnerships across the Middle East. The event includes keynote sessions, workshops, and VIP networking dinners.",
    },
    eventRequirements: {
      venueType: "Luxury Hotel Ballroom",
      additionalServices: "Hotel Accommodation",
      additionalRequirements: "Need VIP airport transfers, a luxury gala dinner setup, Arabic & English speaking staff, and vegetarian meal options for attendees.",
    },
    budget: {
      estimatedBudget: "$25,000",
      budgetFlexibility: "Fixed Budget",
      source: "Instagram Advertisement",
    }
  };
};
