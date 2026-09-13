export type GuestRecordType =
  | "trip"
  | "hotel"
  | "transport"
  | "plan_your_trip"
  | "b2b"
  | "events";

export function getRecordKind(type: GuestRecordType): "booking" | "request" {
  return type === "trip" || type === "hotel" || type === "transport" ? "booking" : "request";
}

export function isBookingType(type: GuestRecordType): boolean {
  return getRecordKind(type) === "booking";
}

export interface PendingGuestRecord {
  email: string;
  name?: string;
  type: GuestRecordType;
  kind?: "booking" | "request";
  id?: string | number;
  title?: string;
  timestamp: number;
}

const STORAGE_KEY_PENDING = "egyptus_pending_guest_record";
const STORAGE_KEY_EMAIL = "egyptus_guest_auth_email";
const STORAGE_KEY_NAME = "egyptus_guest_auth_name";
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export function savePendingGuestRecord(data: Omit<PendingGuestRecord, "timestamp">): void {
  if (typeof window === "undefined") return;

  const record: PendingGuestRecord = {
    ...data,
    kind: data.kind || getRecordKind(data.type),
    email: data.email.trim(),
    name: data.name?.trim(),
    timestamp: Date.now(),
  };

  try {
    const raw = JSON.stringify(record);
    localStorage.setItem(STORAGE_KEY_PENDING, raw);
    sessionStorage.setItem(STORAGE_KEY_PENDING, raw);

    if (record.email) {
      localStorage.setItem(STORAGE_KEY_EMAIL, record.email);
      sessionStorage.setItem(STORAGE_KEY_EMAIL, record.email);
    }
    if (record.name) {
      localStorage.setItem(STORAGE_KEY_NAME, record.name);
      sessionStorage.setItem(STORAGE_KEY_NAME, record.name);
    }
  } catch (e) {
    console.error("Failed to save pending guest record", e);
  }
}

export function getPendingGuestRecord(): PendingGuestRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw =
      localStorage.getItem(STORAGE_KEY_PENDING) ||
      sessionStorage.getItem(STORAGE_KEY_PENDING);
    if (!raw) return null;

    const parsed: PendingGuestRecord = JSON.parse(raw);
    const savedAt = Number(parsed.timestamp || 0);

    if (savedAt && Date.now() - savedAt > EXPIRY_MS) {
      clearPendingGuestRecord();
      return null;
    }

    if (!parsed.kind) {
      parsed.kind = getRecordKind(parsed.type);
    }

    return parsed;
  } catch (e) {
    console.error("Failed to read pending guest record", e);
    return null;
  }
}

export function clearPendingGuestRecord(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY_PENDING);
    sessionStorage.removeItem(STORAGE_KEY_PENDING);
    localStorage.removeItem(STORAGE_KEY_EMAIL);
    sessionStorage.removeItem(STORAGE_KEY_EMAIL);
    localStorage.removeItem(STORAGE_KEY_NAME);
    sessionStorage.removeItem(STORAGE_KEY_NAME);
  } catch {}
}

export function getGuestAuthEmail(): string {
  if (typeof window === "undefined") return "";

  try {
    const direct =
      localStorage.getItem(STORAGE_KEY_EMAIL) ||
      sessionStorage.getItem(STORAGE_KEY_EMAIL);
    if (direct) return direct.trim();

    const pending = getPendingGuestRecord();
    return pending?.email || "";
  } catch {
    return "";
  }
}

export function getGuestAuthName(): string {
  if (typeof window === "undefined") return "";

  try {
    const direct =
      localStorage.getItem(STORAGE_KEY_NAME) ||
      sessionStorage.getItem(STORAGE_KEY_NAME);
    if (direct) return direct.trim();

    const pending = getPendingGuestRecord();
    return pending?.name || "";
  } catch {
    return "";
  }
}
