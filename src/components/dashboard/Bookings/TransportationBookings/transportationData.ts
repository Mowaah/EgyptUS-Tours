export const transportationSummaryMetrics = [
  { label: "Total Transportation Bookings", value: "1,284", change: "-5.1%", trend: "down", tone: "pink", icon: "booking/trips/total" },
  { label: "Upcoming Transportation", value: "20", change: "+8.2%", trend: "up", tone: "blue", icon: "booking/car" },
  { label: "Pending Deposits", value: "200", change: "-5.1%", trend: "down", tone: "orange", icon: "booking/trips/pending" },
  { label: "Completed Transportation", value: "5", change: "+8.2%", trend: "up", tone: "green", icon: "booking/trips/completed" }
];

export interface TransportationBooking {
  id: string;
  customerName: string;
  vehicleClass: string;
  dateTime: string;
  route: string;
  tripType: string;
  depositStatus: "Paid" | "Pending" | "Overdue";
  status: "Upcoming" | "Canceled" | "Refunded" | "On Trip" | "Completed";
  source: "Website" | "Agent";
  assignedTo: {
    name: string;
    avatarUrl: string;
  };
}

export const mockTransportationData: TransportationBooking[] = [
  {
    id: "BK-TR01",
    customerName: "Ahmed Hassan",
    vehicleClass: "Mercedes V-Class",
    dateTime: "Mar 20, 10:00",
    route: "Cairo -> Hurghada",
    tripType: "One Way",
    depositStatus: "Paid",
    status: "Upcoming",
    source: "Website",
    assignedTo: {
      name: "Sara M.",
      avatarUrl: "/images/dashboard/sara.jpg",
    },
  },
  {
    id: "BK-TR02",
    customerName: "Linda Blair",
    vehicleClass: "Toyota Coaster",
    dateTime: "Mar 20, 10:00",
    route: "Luxor -> Aswan",
    tripType: "Round Trip",
    depositStatus: "Pending",
    status: "Upcoming",
    source: "Agent",
    assignedTo: {
      name: "Sara M.",
      avatarUrl: "/images/dashboard/sara.jpg",
    },
  },
  {
    id: "BK-TR03",
    customerName: "Mohammad Karim",
    vehicleClass: "Bus (50 Seats)",
    dateTime: "Mar 20, 10:00",
    route: "Luxor -> Aswan",
    tripType: "One Way",
    depositStatus: "Overdue",
    status: "Upcoming",
    source: "Website",
    assignedTo: {
      name: "Sara M.",
      avatarUrl: "/images/dashboard/sara.jpg",
    },
  },
  {
    id: "BK-TR04",
    customerName: "Ilham Budi Agung",
    vehicleClass: "Hyundai H1",
    dateTime: "Mar 20, 10:00",
    route: "Luxor -> Aswan",
    tripType: "Round Trip",
    depositStatus: "Paid",
    status: "Canceled",
    source: "Agent",
    assignedTo: {
      name: "Sara M.",
      avatarUrl: "/images/dashboard/sara.jpg",
    },
  },
  {
    id: "BK-TR05",
    customerName: "John Bushmill",
    vehicleClass: "Bus (50 Seats)",
    dateTime: "Mar 20, 10:00",
    route: "Luxor -> Aswan",
    tripType: "One Way",
    depositStatus: "Pending",
    status: "Canceled",
    source: "Website",
    assignedTo: {
      name: "Sara M.",
      avatarUrl: "/images/dashboard/sara.jpg",
    },
  },
  {
    id: "BK-TR06",
    customerName: "Linda Blair",
    vehicleClass: "Toyota Coaster",
    dateTime: "Mar 20, 10:00",
    route: "Luxor -> Aswan",
    tripType: "Round Trip",
    depositStatus: "Overdue",
    status: "Refunded",
    source: "Website",
    assignedTo: {
      name: "Sara M.",
      avatarUrl: "/images/dashboard/avatar1.jpg",
    },
  },
  {
    id: "BK-TR07",
    customerName: "Josh Adam",
    vehicleClass: "Hyundai H1",
    dateTime: "Mar 20, 10:00",
    route: "Luxor -> Aswan",
    tripType: "One Way",
    depositStatus: "Paid",
    status: "On Trip",
    source: "Website",
    assignedTo: {
      name: "Sara M.",
      avatarUrl: "/images/dashboard/avatar1.jpg",
    },
  },
  {
    id: "BK-TR08",
    customerName: "Linda Blair",
    vehicleClass: "Hyundai H1",
    dateTime: "Mar 20, 10:00",
    route: "Luxor -> Aswan",
    tripType: "Round Trip",
    depositStatus: "Paid",
    status: "Completed",
    source: "Website",
    assignedTo: {
      name: "Sara M.",
      avatarUrl: "/images/dashboard/avatar1.jpg",
    },
  },
  {
    id: "BK-TR09",
    customerName: "Josh Adam",
    vehicleClass: "Hyundai H1",
    dateTime: "Mar 20, 10:00",
    route: "Luxor -> Aswan",
    tripType: "One Way",
    depositStatus: "Paid",
    status: "Completed",
    source: "Website",
    assignedTo: {
      name: "Sara M.",
      avatarUrl: "/images/dashboard/avatar1.jpg",
    },
  }
];
