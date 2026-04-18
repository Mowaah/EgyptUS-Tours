export interface EventProposalData {
  organization: {
    name: string;
    industry: string;
    country: string;
    website: string;
    contactPerson: string;
    jobTitle: string;
    email: string;
    phone: string;
  };
  eventDetails: {
    eventType: string;
    eventName: string;
    expectedAttendees: string;
    preferredCity: string;
    startDate: string;
    endDate: string;
    description: string;
  };
  requirements: {
    venueType: string;
    additionalServices: string[];
    additionalRequirements: string;
  };
  budget: {
    estimatedBudget: string;
    budgetFlexibility: string;
    hearAboutUs: string;
  };
}

export type EventStep = 1 | 2 | 3 | 4;
