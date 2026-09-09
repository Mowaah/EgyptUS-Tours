import { Trip, Hotel, HotelRoom } from "@/types";
import { BookingData } from "@/types";
import { MultiCurrencyPrice } from "@/constants/currency";

export const CHILD_POLICY = {
  freeThroughAge: 2,
  quarterRateThroughAge: 5,
  halfRateThroughAge: 11,
  bannerText: "Child pricing: 6-11 yrs 50% · 2-5 yrs 25% · Under 2 free",
};

export const ROOM_TYPE_CAPACITY: Record<string, number> = {
  single: 1,
  double: 2,
  triple: 3,
};

export const ROOM_TYPE_CHILD_CAPACITY: Record<string, number> = {
  single: 2,
  double: 2,
  triple: 1,
};

export function getChildPriceFraction(age: number): number {
  if (age <= CHILD_POLICY.freeThroughAge) return 0;
  if (age <= CHILD_POLICY.quarterRateThroughAge) return 0.25;
  if (age <= CHILD_POLICY.halfRateThroughAge) return 0.50;
  return 1.00;
}

export function normalizeRoomType(value?: string | null): "single" | "double" | "triple" {
  if (!value) return "double";
  const key = value.toLowerCase();
  if (key.includes("single")) return "single";
  if (key.includes("triple")) return "triple";
  return "double";
}

export function getRoomSubtitle(roomType: string): string {
  const t = normalizeRoomType(roomType);
  if (t === "single") return "1 Adult , 2 Children";
  if (t === "double") return "2 Adults , 2 Children";
  if (t === "triple") return "3 Adults , 1 Child";
  return "2 Adults , 2 Children";
}

export function allocateAdultsToRooms(
  roomRows: Array<{ roomType: string; quantity: number }>,
  totalAdults: number
): number[] {
  const allocations = new Array(roomRows.length).fill(0);
  let remaining = Math.max(0, totalAdults);

  // Sort room indices by adult capacity descending (triple -> double -> single)
  const sortedIndices = roomRows
    .map((row, idx) => ({ idx, cap: ROOM_TYPE_CAPACITY[normalizeRoomType(row.roomType)] || 2 }))
    .sort((a, b) => b.cap - a.cap)
    .map((item) => item.idx);

  for (const index of sortedIndices) {
    const row = roomRows[index];
    const roomCap = (ROOM_TYPE_CAPACITY[normalizeRoomType(row.roomType)] || 2) * row.quantity;
    const assigned = Math.min(remaining, roomCap);
    allocations[index] = assigned;
    remaining -= assigned;
  }

  return allocations;
}

export interface ChildOccupant {
  childIndex: number;
  age: number;
  priceFraction: number;
}

export interface RoomLineItem {
  roomType: "single" | "double" | "triple";
  roomName: string;
  viewLabel: string;
  categoryLabel?: string;
  quantity: number;
  adultCount: number;
  children: ChildOccupant[];
  unitPrice: number;
  unitPrices?: MultiCurrencyPrice;
  adultTotal: number;
  childrenTotal: number;
  lineTotal: number;
  lineTotals?: MultiCurrencyPrice;
  nights?: number;
}

export function parseDiscountPercent(val?: string | number | null): number {
  if (val == null) return 0;
  if (typeof val === "number") return val > 0 && val <= 100 ? val : 0;
  const match = val.match(/(\d+(\.\d+)?)/);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  return !isNaN(num) && num > 0 && num <= 100 ? num : 0;
}

export interface BookingPricingSummary {
  lineItems: RoomLineItem[];
  subtotal: number;
  subtotalPrices: MultiCurrencyPrice;
  discountAmount: number;
  discountPercent: number;
  discountTitle?: string;
  discountPrices: MultiCurrencyPrice;
  total: number;
  depositAmount: number;
  remainingAmount: number;
  isDepositFull: boolean;
  totalPrices: MultiCurrencyPrice;
  depositPrices: MultiCurrencyPrice;
  remainingPrices: MultiCurrencyPrice;
}

/**
 * Resolves the applicable season for a trip by matching tour_type and travel date,
 * following the backend logic in pricing.py (_resolve_applicable_season).
 */
export function resolveApplicableSeason<
  T extends {
    tourType?: "private" | "group";
    startDate?: string | null;
    endDate?: string | null;
    order?: number;
    label?: string;
  }
>(
  seasons: T[],
  tourType: "private" | "group" = "private",
  startDateStr?: string
): T | undefined {
  if (!seasons || seasons.length === 0) return undefined;

  let tourSeasons = seasons.filter((s) => (s.tourType || "private") === tourType);
  if (tourSeasons.length === 0) tourSeasons = seasons;

  if (!startDateStr) return tourSeasons[0];

  const onDate = new Date(startDateStr);
  if (isNaN(onDate.getTime())) return tourSeasons[0];

  const dateMatch = tourSeasons.find((s) => {
    if (s.startDate && s.endDate) {
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        if (start <= end) {
          return onDate >= start && onDate <= end;
        }
        return onDate >= start || onDate <= end;
      }
    }

    if (s.label) {
      const monthNum = onDate.getMonth() + 1; // 1-12
      const lower = s.label.toLowerCase();
      if (lower.includes("christmas") || lower.includes("new year")) {
        return monthNum === 12 || monthNum === 1;
      }
      const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      const currentMonthStr = months[monthNum - 1];
      if (lower.includes(currentMonthStr)) {
        return true;
      }
    }
    return false;
  });

  return dateMatch || tourSeasons[0];
}

/**
 * Calculate pricing for Trip booking matching backend pricing.py
 */
export function calculateTripBookingPrice(
  trip: Trip,
  formData: BookingData,
  tourType: "private" | "group" = "private"
): BookingPricingSummary {
  const seasons = trip.seasonPricing || [];
  const baseSeason = resolveApplicableSeason(seasons, tourType, formData.startDate) || seasons[0];
  const addOns = trip.additionalRooms || {};

  // Build room rows from formData.rooms & customizations
  const roomRows: Array<{ roomType: "single" | "double" | "triple"; viewLabel: string; quantity: number }> = [];
  const roomCounts = formData.rooms || {};

  (["single", "double", "triple"] as const).forEach((type) => {
    const count = roomCounts[type] || 0;
    if (count <= 0) return;
    const customizations = formData.roomCustomizations?.[type] || [];

    // Group by viewLabel
    const viewCounts: Record<string, number> = {};
    for (let i = 0; i < count; i++) {
      const opt = customizations[i] || "garden";
      let view = "Garden View";
      if (opt.toLowerCase().includes("sea")) view = "Sea View";
      else if (opt.toLowerCase().includes("pool")) view = "Pool View";
      viewCounts[view] = (viewCounts[view] || 0) + 1;
    }

    Object.entries(viewCounts).forEach(([viewLabel, quantity]) => {
      roomRows.push({
        roomType: type,
        viewLabel,
        quantity,
      });
    });
  });

  const adultAllocations = allocateAdultsToRooms(roomRows, formData.adults);
  const childrenAges = formData.childrenAges || [];
  const childRoomPricing = formData.childRoomPricing || [];

  const getTierPrice = (roomType: "single" | "double" | "triple", currency: "usd" | "egp" | "eur"): number => {
    if (!baseSeason) {
      const fallback = trip.price || trip.privatePrice || 0;
      if (currency === "egp") return fallback * 50;
      if (currency === "eur") return fallback;
      return fallback;
    }
    if (roomType === "single") {
      if (currency === "egp") return baseSeason.singleEgp || (baseSeason.singlePrices?.egp ? Number(baseSeason.singlePrices.egp) : baseSeason.single * 50);
      if (currency === "eur") return baseSeason.singleEur || (baseSeason.singlePrices?.eur ? Number(baseSeason.singlePrices.eur) : baseSeason.single);
      return baseSeason.singlePrices?.usd ? Number(baseSeason.singlePrices.usd) : baseSeason.single;
    }
    if (roomType === "triple") {
      if (currency === "egp") return baseSeason.tripleEgp || (baseSeason.triplePrices?.egp ? Number(baseSeason.triplePrices.egp) : baseSeason.triple * 50);
      if (currency === "eur") return baseSeason.tripleEur || (baseSeason.triplePrices?.eur ? Number(baseSeason.triplePrices.eur) : baseSeason.triple);
      return baseSeason.triplePrices?.usd ? Number(baseSeason.triplePrices.usd) : baseSeason.triple;
    }
    // double
    if (currency === "egp") return baseSeason.doubleEgp || (baseSeason.doublePrices?.egp ? Number(baseSeason.doublePrices.egp) : baseSeason.double * 50);
    if (currency === "eur") return baseSeason.doubleEur || (baseSeason.doublePrices?.eur ? Number(baseSeason.doublePrices.eur) : baseSeason.double);
    return baseSeason.doublePrices?.usd ? Number(baseSeason.doublePrices.usd) : baseSeason.double;
  };

  const getViewSurcharge = (viewLabel: string, currency: "usd" | "egp" | "eur"): number => {
    const v = viewLabel.toLowerCase();
    if (v.includes("sea")) {
      if (currency === "egp") return addOns.seaViewEgp || (addOns.seaViewPrices?.egp ? Number(addOns.seaViewPrices.egp) : (addOns.seaView || 0) * 50);
      if (currency === "eur") return addOns.seaViewEur || (addOns.seaViewPrices?.eur ? Number(addOns.seaViewPrices.eur) : addOns.seaView || 0);
      return addOns.seaViewPrices?.usd ? Number(addOns.seaViewPrices.usd) : addOns.seaView || 0;
    }
    if (v.includes("pool")) {
      if (currency === "egp") return addOns.poolViewEgp || (addOns.poolViewPrices?.egp ? Number(addOns.poolViewPrices.egp) : (addOns.poolView || 0) * 50);
      if (currency === "eur") return addOns.poolViewEur || (addOns.poolViewPrices?.eur ? Number(addOns.poolViewPrices.eur) : addOns.poolView || 0);
      return addOns.poolViewPrices?.usd ? Number(addOns.poolViewPrices.usd) : addOns.poolView || 0;
    }
    return 0;
  };

  const assignedChildIndices = new Set<number>();
  const lineItems: RoomLineItem[] = roomRows.map((row, index) => {
    const adultCount = adultAllocations[index];
    const maxRowChildren = (ROOM_TYPE_CHILD_CAPACITY[row.roomType] || 1) * row.quantity;

    // Find children assigned to this room type and view
    const assignedChildren: ChildOccupant[] = [];
    for (let cIdx = 0; cIdx < formData.children; cIdx++) {
      if (assignedChildIndices.has(cIdx)) continue;
      if (assignedChildren.length >= maxRowChildren) break;

      const assignment = childRoomPricing[cIdx] || "";
      const assignedType = normalizeRoomType(assignment);
      if (assignedType !== row.roomType) continue;

      // If assignment specifies a view, ensure it matches row view
      const assignLower = assignment.toLowerCase();
      const rowViewLower = row.viewLabel.toLowerCase();
      const hasSpecificView = assignLower.includes("sea") || assignLower.includes("pool") || assignLower.includes("garden");
      if (hasSpecificView) {
        if (assignLower.includes("sea") && !rowViewLower.includes("sea")) continue;
        if (assignLower.includes("pool") && !rowViewLower.includes("pool")) continue;
        if (assignLower.includes("garden") && !rowViewLower.includes("garden")) continue;
      }

      assignedChildIndices.add(cIdx);
      const age = childrenAges[cIdx] != null ? childrenAges[cIdx] : 8;
      assignedChildren.push({
        childIndex: cIdx,
        age,
        priceFraction: getChildPriceFraction(age),
      });
    }

    // Second pass for any unassigned children of this room type (e.g. without specific view hint)
    if (assignedChildren.length < maxRowChildren) {
      for (let cIdx = 0; cIdx < formData.children; cIdx++) {
        if (assignedChildIndices.has(cIdx)) continue;
        if (assignedChildren.length >= maxRowChildren) break;

        const assignment = childRoomPricing[cIdx] || "";
        const assignedType = normalizeRoomType(assignment);
        if (assignedType !== row.roomType) continue;

        assignedChildIndices.add(cIdx);
        const age = childrenAges[cIdx] != null ? childrenAges[cIdx] : 8;
        assignedChildren.push({
          childIndex: cIdx,
          age,
          priceFraction: getChildPriceFraction(age),
        });
      }
    }

    const unitPriceUsd = getTierPrice(row.roomType, "usd") + getViewSurcharge(row.viewLabel, "usd");
    const unitPriceEgp = getTierPrice(row.roomType, "egp") + getViewSurcharge(row.viewLabel, "egp");
    const unitPriceEur = getTierPrice(row.roomType, "eur") + getViewSurcharge(row.viewLabel, "eur");

    const adultTotalUsd = unitPriceUsd * adultCount;
    const adultTotalEgp = unitPriceEgp * adultCount;
    const adultTotalEur = unitPriceEur * adultCount;

    const childrenTotalUsd = assignedChildren.reduce((acc, ch) => acc + unitPriceUsd * ch.priceFraction, 0);
    const childrenTotalEgp = assignedChildren.reduce((acc, ch) => acc + unitPriceEgp * ch.priceFraction, 0);
    const childrenTotalEur = assignedChildren.reduce((acc, ch) => acc + unitPriceEur * ch.priceFraction, 0);

    const lineTotalUsd = adultTotalUsd + childrenTotalUsd;
    const lineTotalEgp = adultTotalEgp + childrenTotalEgp;
    const lineTotalEur = adultTotalEur + childrenTotalEur;

    const typeTitle = row.roomType === "single" ? "Single Room" : row.roomType === "triple" ? "Triple Room" : "Double Room";

    return {
      roomType: row.roomType,
      roomName: typeTitle,
      viewLabel: row.viewLabel,
      quantity: row.quantity,
      adultCount,
      children: assignedChildren,
      unitPrice: unitPriceUsd,
      unitPrices: { usd: unitPriceUsd, egp: unitPriceEgp, eur: unitPriceEur },
      adultTotal: adultTotalUsd,
      childrenTotal: childrenTotalUsd,
      lineTotal: lineTotalUsd,
      lineTotals: { usd: lineTotalUsd, egp: lineTotalEgp, eur: lineTotalEur },
    };
  });

  const subtotalUsd = lineItems.reduce((acc, item) => acc + item.lineTotal, 0);
  const subtotalEgp = lineItems.reduce((acc, item) => acc + Number(item.lineTotals?.egp || 0), 0);
  const subtotalEur = lineItems.reduce((acc, item) => acc + Number(item.lineTotals?.eur || 0), 0);

  const discountPercent = parseDiscountPercent(trip.discountValue || trip.discountLabel);
  const hasDiscount = discountPercent > 0;
  const discountTitle =
    (trip as any)?.promotion?.title ||
    (trip as any)?.promotion_title ||
    trip.discountTitle ||
    trip.discountLabel ||
    (hasDiscount ? "Special Discount" : undefined);

  const discountUsd = hasDiscount ? (subtotalUsd * discountPercent) / 100 : 0;
  const discountEgp = hasDiscount ? (subtotalEgp * discountPercent) / 100 : 0;
  const discountEur = hasDiscount ? (subtotalEur * discountPercent) / 100 : 0;

  const totalUsd = Math.max(0, subtotalUsd - discountUsd);
  const totalEgp = Math.max(0, subtotalEgp - discountEgp);
  const totalEur = Math.max(0, subtotalEur - discountEur);

  const isDepositFull = (() => {
    if (!formData.startDate) return false;
    const startDate = new Date(formData.startDate);
    const today = new Date();
    const daysUntil = (startDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return daysUntil <= 30;
  })();

  const depositRate = isDepositFull ? 1 : 0.30;
  const remainingRate = isDepositFull ? 0 : 0.70;

  return {
    lineItems,
    subtotal: subtotalUsd,
    subtotalPrices: { usd: subtotalUsd, egp: subtotalEgp, eur: subtotalEur },
    discountAmount: discountUsd,
    discountPercent: hasDiscount ? discountPercent : 0,
    discountTitle,
    discountPrices: { usd: discountUsd, egp: discountEgp, eur: discountEur },
    total: totalUsd,
    depositAmount: totalUsd * depositRate,
    remainingAmount: totalUsd * remainingRate,
    isDepositFull,
    totalPrices: { usd: totalUsd, egp: totalEgp, eur: totalEur },
    depositPrices: { usd: totalUsd * depositRate, egp: totalEgp * depositRate, eur: totalEur * depositRate },
    remainingPrices: { usd: totalUsd * remainingRate, egp: totalEgp * remainingRate, eur: totalEur * remainingRate },
  };
}

/**
 * Calculate pricing for Hotel booking matching backend hotel_pricing.py
 */
export function calculateHotelBookingPrice(
  hotel: Hotel,
  formData: BookingData
): BookingPricingSummary {
  const nights = (() => {
    if (!formData.startDate || !formData.endDate) return 1;
    const diff = Math.round(
      (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / 86400000
    );
    return diff > 0 ? diff : 1;
  })();

  const hotelRooms = hotel.hotelRooms || [];
  const roomCounts = formData.rooms || {};
  const roomCustomizations = formData.roomCustomizations || {};

  // Build room rows
  const roomRows: Array<{
    hotelRoomId?: string;
    roomType: "single" | "double" | "triple";
    roomName: string;
    categoryLabel: string;
    viewLabel: string;
    quantity: number;
    room?: HotelRoom;
  }> = [];

  Object.entries(roomCounts).forEach(([type, count]) => {
    if (!count || count <= 0) return;
    const customList = roomCustomizations[type] || [];
    const roomsOfType = hotelRooms.filter((r) => normalizeRoomType(r.type) === type.toLowerCase());
    const baseRoom = roomsOfType[0];

    // Group by roomId or view
    const grouped: Record<string, { room: HotelRoom; quantity: number }> = {};
    for (let i = 0; i < count; i++) {
      const customId = customList[i];
      const room = hotelRooms.find((r) => r.id === customId) || baseRoom;
      if (!room) continue;
      const key = room.id || `${type}_${room.view}`;
      if (!grouped[key]) {
        grouped[key] = { room, quantity: 0 };
      }
      grouped[key].quantity += 1;
    }

    Object.values(grouped).forEach(({ room, quantity }) => {
      const typeKey = normalizeRoomType(room.type);
      roomRows.push({
        hotelRoomId: room.id,
        roomType: typeKey,
        roomName: room.name,
        categoryLabel: room.category || "Standard",
        viewLabel: room.view || "Garden View",
        quantity,
        room,
      });
    });
  });

  const adultAllocations = allocateAdultsToRooms(roomRows, formData.adults);
  const childrenAges = formData.childrenAges || [];
  const childRoomPricing = formData.childRoomPricing || [];

  const getEffectiveNightlyRate = (room?: HotelRoom, currency: "usd" | "egp" | "eur" = "usd"): number => {
    if (!room) {
      if (currency === "egp") return hotel.pricePerNightEgp || (hotel.prices?.egp ? Number(hotel.prices.egp) : (hotel.pricePerNight || 0) * 50);
      if (currency === "eur") return hotel.pricePerNightEur || (hotel.prices?.eur ? Number(hotel.prices.eur) : hotel.pricePerNight || 0);
      return hotel.prices?.usd ? Number(hotel.prices.usd) : hotel.pricePerNight || 0;
    }

    let rate = currency === "egp"
      ? (room.pricePerNightEgp || (room.prices?.egp ? Number(room.prices.egp) : (room.pricePerNight || 0) * 50))
      : currency === "eur"
      ? (room.pricePerNightEur || (room.prices?.eur ? Number(room.prices.eur) : room.pricePerNight || 0))
      : (room.prices?.usd ? Number(room.prices.usd) : room.pricePerNight || 0);

    if (room.discountPercent) {
      rate = rate * (1 - room.discountPercent / 100);
    }
    return Math.max(0, rate);
  };

  const assignedChildIndices = new Set<number>();
  const lineItems: RoomLineItem[] = roomRows.map((row, index) => {
    const adultCount = adultAllocations[index];
    const maxRowChildren = (row.roomType === "single" ? 1 : 2) * row.quantity;

    // Children assigned to this room type
    const assignedChildren: ChildOccupant[] = [];
    for (let cIdx = 0; cIdx < formData.children; cIdx++) {
      if (assignedChildIndices.has(cIdx)) continue;
      if (assignedChildren.length >= maxRowChildren) break;

      const assignment = childRoomPricing[cIdx] || "";
      const assignedType = normalizeRoomType(assignment);
      if (assignedType !== row.roomType) continue;

      // Check view or room id hint
      const assignLower = assignment.toLowerCase();
      const rowViewLower = (row.viewLabel || "").toLowerCase();
      const hasSpecificView = assignLower.includes("sea") || assignLower.includes("pool") || assignLower.includes("garden") || assignLower.includes("standard");
      if (hasSpecificView) {
        if (assignLower.includes("sea") && !rowViewLower.includes("sea")) continue;
        if (assignLower.includes("pool") && !rowViewLower.includes("pool")) continue;
        if (assignLower.includes("garden") && !rowViewLower.includes("garden")) continue;
        if (assignLower.includes("standard") && !rowViewLower.includes("standard")) continue;
      }
      if (row.hotelRoomId && assignment.includes(String(row.hotelRoomId))) {
        // Exact room id match
      }

      assignedChildIndices.add(cIdx);
      const age = childrenAges[cIdx] != null ? childrenAges[cIdx] : 8;
      assignedChildren.push({
        childIndex: cIdx,
        age,
        priceFraction: getChildPriceFraction(age),
      });
    }

    // Second pass for remaining unassigned children of this room type
    if (assignedChildren.length < maxRowChildren) {
      for (let cIdx = 0; cIdx < formData.children; cIdx++) {
        if (assignedChildIndices.has(cIdx)) continue;
        if (assignedChildren.length >= maxRowChildren) break;

        const assignment = childRoomPricing[cIdx] || "";
        const assignedType = normalizeRoomType(assignment);
        if (assignedType !== row.roomType) continue;

        assignedChildIndices.add(cIdx);
        const age = childrenAges[cIdx] != null ? childrenAges[cIdx] : 8;
        assignedChildren.push({
          childIndex: cIdx,
          age,
          priceFraction: getChildPriceFraction(age),
        });
      }
    }

    const nightlyUsd = getEffectiveNightlyRate(row.room, "usd");
    const nightlyEgp = getEffectiveNightlyRate(row.room, "egp");
    const nightlyEur = getEffectiveNightlyRate(row.room, "eur");

    const adultTotalUsd = nightlyUsd * adultCount * nights;
    const adultTotalEgp = nightlyEgp * adultCount * nights;
    const adultTotalEur = nightlyEur * adultCount * nights;

    const childrenTotalUsd = assignedChildren.reduce((acc, ch) => acc + nightlyUsd * ch.priceFraction * nights, 0);
    const childrenTotalEgp = assignedChildren.reduce((acc, ch) => acc + nightlyEgp * ch.priceFraction * nights, 0);
    const childrenTotalEur = assignedChildren.reduce((acc, ch) => acc + nightlyEur * ch.priceFraction * nights, 0);

    const lineTotalUsd = adultTotalUsd + childrenTotalUsd;
    const lineTotalEgp = adultTotalEgp + childrenTotalEgp;
    const lineTotalEur = adultTotalEur + childrenTotalEur;

    return {
      roomType: row.roomType,
      roomName: row.roomName,
      viewLabel: row.viewLabel,
      categoryLabel: row.categoryLabel,
      quantity: row.quantity,
      nights,
      adultCount,
      children: assignedChildren,
      unitPrice: nightlyUsd,
      unitPrices: { usd: nightlyUsd, egp: nightlyEgp, eur: nightlyEur },
      adultTotal: adultTotalUsd,
      childrenTotal: childrenTotalUsd,
      lineTotal: lineTotalUsd,
      lineTotals: { usd: lineTotalUsd, egp: lineTotalEgp, eur: lineTotalEur },
    };
  });

  const subtotalUsd = lineItems.reduce((acc, item) => acc + item.lineTotal, 0);
  const subtotalEgp = lineItems.reduce((acc, item) => acc + Number(item.lineTotals?.egp || 0), 0);
  const subtotalEur = lineItems.reduce((acc, item) => acc + Number(item.lineTotals?.eur || 0), 0);

  const discountPercent = parseDiscountPercent(hotel.discountValue);
  const hasDiscount = discountPercent > 0;
  const discountTitle =
    (hotel as any)?.promotion?.title ||
    (hotel as any)?.promotion_title ||
    hotel.discountTitle ||
    (hasDiscount ? "Special Discount" : undefined);

  const discountUsd = hasDiscount ? (subtotalUsd * discountPercent) / 100 : 0;
  const discountEgp = hasDiscount ? (subtotalEgp * discountPercent) / 100 : 0;
  const discountEur = hasDiscount ? (subtotalEur * discountPercent) / 100 : 0;

  const totalUsd = Math.max(0, subtotalUsd - discountUsd);
  const totalEgp = Math.max(0, subtotalEgp - discountEgp);
  const totalEur = Math.max(0, subtotalEur - discountEur);

  const depositRate = 0.30;
  const remainingRate = 0.70;

  return {
    lineItems,
    subtotal: subtotalUsd,
    subtotalPrices: { usd: subtotalUsd, egp: subtotalEgp, eur: subtotalEur },
    discountAmount: discountUsd,
    discountPercent: hasDiscount ? discountPercent : 0,
    discountTitle,
    discountPrices: { usd: discountUsd, egp: discountEgp, eur: discountEur },
    total: totalUsd,
    depositAmount: totalUsd * depositRate,
    remainingAmount: totalUsd * remainingRate,
    isDepositFull: false,
    totalPrices: { usd: totalUsd, egp: totalEgp, eur: totalEur },
    depositPrices: { usd: totalUsd * depositRate, egp: totalEgp * depositRate, eur: totalEur * depositRate },
    remainingPrices: { usd: totalUsd * remainingRate, egp: totalEgp * remainingRate, eur: totalEur * remainingRate },
  };
}
