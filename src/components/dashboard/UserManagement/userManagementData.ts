import type { AdminUserRow } from "./types";

const baseUsers: Omit<AdminUserRow, "id">[] = [
  {
    name: "Mona Saleh",
    email: "mona@travelco.com",
    role: "Super Admin",
    lastLogin: "2025-04-24 10:12",
    state: "Active",
  },
  {
    name: "Ahmed Hassan",
    email: "ahmed.hassan@travelco.com",
    role: "Operations",
    lastLogin: "2025-04-23 16:45",
    state: "Active",
  },
  {
    name: "Linda Blair",
    email: "lindablair@mail.com",
    role: "Sales",
    lastLogin: "2025-04-22 09:30",
    state: "Inactive",
  },
  {
    name: "Mohammad Karim",
    email: "m_karim@mail.com",
    role: "Support",
    lastLogin: "2025-04-21 14:08",
    state: "Active",
  },
  {
    name: "John Bushmill",
    email: "Johnb@mail.com",
    role: "Operations",
    lastLogin: "2025-04-20 11:22",
    state: "Inactive",
  },
];

export const mockAdminUsers: AdminUserRow[] = Array.from({ length: 15 }, (_, index) => ({
  ...baseUsers[index % baseUsers.length],
  id: `ADMIN-${String(16 - index).padStart(3, "0")}`,
}));
