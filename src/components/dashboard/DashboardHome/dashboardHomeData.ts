import type {
  ChartLine,
  DestinationItem,
  DistributionItem,
  MetricCardData,
  PendingAction,
} from "./types";

export const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export const metricCards: MetricCardData[] = [
  { label: "Total Bookings", value: "1,284", change: "+12.5%", trend: "up", tone: "blue", icon: "total-bookings", spark: "M0 34 C18 22 28 42 44 29 S72 37 90 25 S124 31 144 12 S178 18 208 4" },
  { label: "Total Revenue", value: "$ 284,50", change: "+8.2%", trend: "up", tone: "green", icon: "total-revenue", spark: "M0 31 C24 24 34 35 52 27 S86 35 104 22 S134 26 150 12 S178 15 208 5" },
  { label: "Pending Confirmations", value: "16", change: "-5.1%", trend: "down", tone: "orange", icon: "pending-confirmation", spark: "M0 5 C20 12 28 4 46 18 S78 25 96 31 S130 34 148 28 S178 20 208 25" },
  { label: "New Leads Today", value: "24", change: "+18.3%", trend: "up", tone: "purple", icon: "new-leads", spark: "M0 28 C18 23 32 33 50 25 S80 34 102 27 S138 30 152 18 S184 16 208 5" },
  { label: "Upcoming Departures", value: "56", change: "+12.5%", trend: "up", tone: "pink", icon: "upcoming-deartures", spark: "M0 30 C16 24 34 29 48 34 S78 31 94 26 S124 36 140 22 S174 15 208 6" },
  { label: "Outstanding Deposits", value: "$42,180", change: "-5.1%", trend: "down", tone: "amber", icon: "outstanding-deposits", spark: "M0 8 C20 14 28 5 46 22 S78 32 98 27 S136 30 154 22 S184 25 208 28" },
];

export const revenueLines: ChartLine[] = [
  { name: "Trips", color: "#2E93FA", points: [9000, 8500, 3600, 3000, 4600, 7800, 8600, 7400, 4200, 1700, 1400, 5600] },
  { name: "Hotels", color: "#FF8B3D", points: [7100, 6900, 4700, 3400, 4100, 7800, 10100, 10800, 10300, 8800, 6500, 3700] },
  { name: "Transportation", color: "#FB7D91", points: [3200, 3000, 1300, 600, 1200, 5200, 6400, 6700, 6100, 4700, 2900, 700] },
  { name: "MICE", color: "#A23DE0", points: [3900, 1600, 300, 700, 1500, 4700, 4600, 1700, 500, 100, 100, 1200] },
];

export const domesticLines: ChartLine[] = [
  { name: "inside Egypt", color: "rgba(41, 113, 230, 0.7)", areaColor: "#8DC1FF", points: [3200, 6200, 10300, 10500, 4500, 2400, 2100, 4700, 700, 1400, 7800, 9400] },
  { name: "International", color: "#FFD0B0", areaColor: "#FFEDD5", points: [600, 2800, 4200, 4400, 9800, 9000, 3600, 900, 1300, 4100, 5000, 7300] },
];

export const distribution: DistributionItem[] = [
  { label: "Trips", value: 32, color: "#9CC7F7", displayValue: "1,600" },
  { label: "Hotels", value: 22, color: "#FFD7BA", displayValue: "1,100" },
  { label: "Transport", value: 36, color: "#FAD0D5", displayValue: "1,800" },
  { label: "MICE", value: 74, color: "#E5C8F5", displayValue: "3,700" },
  { label: "B2B", value: 58, color: "#B6F3D2", displayValue: "2,900" },
];

export const destinations: DestinationItem[] = [
  { label: "Cairo", value: 40, color: "#A1CCFF" },
  { label: "Hurghada", value: 30, color: "#FFC6A0" },
  { label: "Alexandria", value: 20, color: "#FFD6DD" },
  { label: "Sharm", value: 10, color: "#E9BDFF" },
];

export const pendingActions: PendingAction[] = [
  { title: "New MICE RFP from Global Corp", time: "2 hours ago", tone: "red", icon: "pending-mice", path: "/#1" },
  { title: "Payment verification - BK-1283", time: "3 hours ago", tone: "amber", icon: "pending-payment", path: "/#2" },
  { title: "Booking modification - BK-1275", time: "2 hours ago", tone: "blue", icon: "pending-booking", path: "/#3" },
  { title: "Unread message from Sarah M.", time: "2 hours ago", tone: "amber", icon: "pending-unread", path: "/#4" },
  { title: "B2B partnership application", time: "2 hours ago", tone: "blue", icon: "pending-b2b", path: "/#5" },
];
