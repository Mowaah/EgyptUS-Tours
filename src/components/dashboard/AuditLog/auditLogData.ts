export interface AuditLogEntry {
  uid: string; // Unique row identifier for keys
  id: string; // Record ID e.g., "ADMIN-016"
  timestamp: string; // "2025-04-24 10:32"
  adminUser: string; // e.g. "Mona Saleh"
  action: "Delete Lead" | "Login" | "Update Status" | "Create User" | "Delete Review";
  module: string; // e.g. "Leads & Inquiries", "Finance", "Catalog", etc.
  beforeValue: string; // e.g., "-", "Status: Pending", "Rating: 2 stars"
  afterValue: string; // e.g., "Approved", "-", "Inactive"
}

export const mockAuditLogs: AuditLogEntry[] = [
  {
    uid: "audit-1",
    id: "ADMIN-016",
    timestamp: "2025-04-24 10:32",
    adminUser: "Mona Saleh",
    action: "Delete Lead",
    module: "Leads & Inquiries",
    beforeValue: "-",
    afterValue: "Approved",
  },
  {
    uid: "audit-2",
    id: "ADMIN-016",
    timestamp: "2025-04-24 10:32",
    adminUser: "Mona Saleh",
    action: "Login",
    module: "Finance",
    beforeValue: "-",
    afterValue: "-",
  },
  {
    uid: "audit-3",
    id: "ADMIN-016",
    timestamp: "2025-04-24 10:32",
    adminUser: "Mohammad Karim",
    action: "Update Status",
    module: "Catalog",
    beforeValue: "Status: Pending",
    afterValue: "Inactive",
  },
  {
    uid: "audit-4",
    id: "ADMIN-016",
    timestamp: "2025-04-24 10:32",
    adminUser: "Ilham Budi Agung",
    action: "Create User",
    module: "Bookings",
    beforeValue: "-",
    afterValue: "-",
  },
  {
    uid: "audit-5",
    id: "ADMIN-016",
    timestamp: "2025-04-24 10:32",
    adminUser: "John Bushmill",
    action: "Login",
    module: "Bookings",
    beforeValue: "-",
    afterValue: "-",
  },
  {
    uid: "audit-6",
    id: "ADMIN-016",
    timestamp: "2025-04-24 10:32",
    adminUser: "Linda Blair",
    action: "Delete Review",
    module: "Reviews",
    beforeValue: "Rating: 2 stars",
    afterValue: "-",
  },
  {
    uid: "audit-7",
    id: "ADMIN-016",
    timestamp: "2025-04-24 10:32",
    adminUser: "Josh Adam",
    action: "Update Status",
    module: "Catalog",
    beforeValue: "Status: Pending",
    afterValue: "Inactive",
  },
  {
    uid: "audit-8",
    id: "ADMIN-016",
    timestamp: "2025-04-24 10:32",
    adminUser: "Linda Blair",
    action: "Delete Lead",
    module: "Leads & Inquiries",
    beforeValue: "-",
    afterValue: "-",
  },
  {
    uid: "audit-9",
    id: "ADMIN-016",
    timestamp: "2025-04-24 10:32",
    adminUser: "Josh Adam",
    action: "Create User",
    module: "Bookings",
    beforeValue: "-",
    afterValue: "-",
  },
  {
    uid: "audit-10",
    id: "ADMIN-016",
    timestamp: "2025-04-24 10:32",
    adminUser: "Linda Blair",
    action: "Delete Lead",
    module: "Leads & Inquiries",
    beforeValue: "-",
    afterValue: "-",
  },
  {
    uid: "audit-11",
    id: "ADMIN-016",
    timestamp: "2025-04-24 10:32",
    adminUser: "Josh Adam",
    action: "Create User",
    module: "Bookings",
    beforeValue: "-",
    afterValue: "-",
  },
];
