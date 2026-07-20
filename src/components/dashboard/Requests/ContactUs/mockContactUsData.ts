export interface ContactUsItem {
  id: string;
  ref: string;
  fullName: string;
  email: string;
  message: string;
  submittedOn: string;
  status: string;
  assigned: string;
}

export const mockContactUsData: ContactUsItem[] = [
  { id: "1", ref: "CT-002", fullName: "Ahmed Hassan", email: "ahmed@email.com", message: "Perfect in every way ....", submittedOn: "Apr 10, 2026 • 12:30 PM...", status: "New", assigned: "------" },
  { id: "2", ref: "CT-001", fullName: "Linda Blair", email: "ahmed@email.com", message: "Perfect in every way ....", submittedOn: "Apr 10, 2026 • 12:30 PM...", status: "Replied", assigned: "Sara M." },
  { id: "3", ref: "CT-001", fullName: "Mohammad Karim", email: "ahmed@email.com", message: "Perfect in every way ....", submittedOn: "Apr 10, 2026 • 12:30 PM...", status: "Closed", assigned: "Sara M." },
  { id: "4", ref: "CT-001", fullName: "Ilham Budi Agung", email: "ahmed@email.com", message: "Perfect in every way ....", submittedOn: "Apr 10, 2026 • 12:30 PM...", status: "New", assigned: "Sara M." },
  { id: "5", ref: "CT-001", fullName: "John Bushmill", email: "ahmed@email.com", message: "Perfect in every way ....", submittedOn: "Apr 10, 2026 • 12:30 PM...", status: "Replied", assigned: "Sara M." },
  { id: "6", ref: "CT-001", fullName: "Linda Blair", email: "ahmed@email.com", message: "Perfect in every way ....", submittedOn: "Apr 10, 2026 • 12:30 PM...", status: "Closed", assigned: "Sara M." },
  { id: "7", ref: "CT-001", fullName: "Josh Adam", email: "ahmed@email.com", message: "Perfect in every way ....", submittedOn: "Apr 10, 2026 • 12:30 PM...", status: "New", assigned: "Sara M." },
  { id: "8", ref: "CT-001", fullName: "Linda Blair", email: "ahmed@email.com", message: "Perfect in every way ....", submittedOn: "Apr 10, 2026 • 12:30 PM...", status: "Replied", assigned: "Sara M." },
  { id: "9", ref: "CT-001", fullName: "Josh Adam", email: "ahmed@email.com", message: "Perfect in every way ....", submittedOn: "Apr 10, 2026 • 12:30 PM...", status: "Closed", assigned: "Unassigned" },
  { id: "10", ref: "CT-001", fullName: "Linda Blair", email: "ahmed@email.com", message: "Perfect in every way ....", submittedOn: "Apr 10, 2026 • 12:30 PM...", status: "New", assigned: "Unassigned" },
  { id: "11", ref: "CT-001", fullName: "Josh Adam", email: "ahmed@email.com", message: "Perfect in every way ....", submittedOn: "Apr 10, 2026 • 12:30 PM...", status: "Replied", assigned: "Sara M." },
  { id: "12", ref: "CT-001", fullName: "Linda Blair", email: "ahmed@email.com", message: "Perfect in every way ....", submittedOn: "Apr 10, 2026 • 12:30 PM...", status: "Closed", assigned: "Sara M." },
  { id: "13", ref: "CT-001", fullName: "Josh Adam", email: "ahmed@email.com", message: "Perfect in every way ....", submittedOn: "Apr 10, 2026 • 12:30 PM...", status: "New", assigned: "Sara M." },
  { id: "14", ref: "CT-001", fullName: "Linda Blair", email: "ahmed@email.com", message: "Perfect in every way ....", submittedOn: "Apr 10, 2026 • 12:30 PM...", status: "New", assigned: "Sara M." },
  { id: "15", ref: "CT-001", fullName: "Josh Adam", email: "ahmed@email.com", message: "Perfect in every way ....", submittedOn: "Apr 10, 2026 • 12:30 PM...", status: "New", assigned: "Sara M." },
];

export const getContactUsDetails = (id: string) => {
  const summary = mockContactUsData.find((t) => t.id === id) || mockContactUsData[0];
  return {
    id: summary.ref,
    applicantName: summary.fullName,
    requestNumber: summary.ref,
    date: "April 10, 2025 at 1:20 PM",
    status: summary.status,
    contactInfo: {
      fullName: summary.fullName,
      email: summary.email,
      phone: "+20 109 458 7721",
      message: "Hello, I would like to know more about your private tour packages for Luxor and Aswan. Could you please provide more details?",
    }
  };
};
