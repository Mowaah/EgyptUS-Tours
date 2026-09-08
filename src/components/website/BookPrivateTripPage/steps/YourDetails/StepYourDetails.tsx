import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import RoomSelector, { RoomGroup } from "@/components/dashboard/shared/RoomSelector/RoomSelector";
import {
  BookingStepFooter,
  CheckboxIndicator,
  FormField,
  PhoneInput,
  CustomDatePicker,
  SelectDropdown,
  NationalitySelect,
  CounterPill,
} from "@/components/shared";

import planPage from "../../../PlanYourTripPage/PlanYourTripPage.module.scss";
import travelerStyles from "../../../PlanYourTripPage/steps/TravelerInfo/StepTravelerInfo.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import stepStyles from "./StepYourDetails.module.scss";
import { BookingData } from "../../BookPrivateTripPage";
import { Trip } from "@/types";
import { isValidEmail, isValidPhone } from "@/utils/validators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getRoomSubtitle, ROOM_TYPE_CHILD_CAPACITY, resolveApplicableSeason, normalizeRoomType } from "@/utils/bookingPricing";

interface StepYourDetailsProps {
  trip: Trip;
  formData: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
  onContinue: () => void;
  isGroupTrip?: boolean;
}

const CHILD_AGE_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  label: `${i + 2} years`,
  value: String(i + 2),
}));

export default function StepYourDetails({ trip, formData, onChange, onContinue, isGroupTrip }: StepYourDetailsProps) {
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation("booking");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Extract rooms directly from trip season pricing instead of hotel
  const roomGroups: RoomGroup[] = useMemo(() => {
    const baseSeason = resolveApplicableSeason(trip?.seasonPricing || [], isGroupTrip ? "group" : "private", formData.startDate) || trip?.seasonPricing?.[0];
    if (!baseSeason) return [];
    const addOns = trip?.additionalRooms || {};
    
    const options = [
      { label: "Garden View (Included)", value: "garden", price: "Included", isFree: true },
    ];
    if (addOns.poolView) {
      options.push({ label: "Pool View", value: "pool", price: `+${formatCurrency(addOns.poolViewPrices || addOns.poolView)}`, isFree: false });
    }
    if (addOns.seaView) {
      options.push({ label: "Sea View", value: "sea", price: `+${formatCurrency(addOns.seaViewPrices || addOns.seaView)}`, isFree: false });
    }

    const groups: RoomGroup[] = [];
    if (baseSeason.single > 0) {
      groups.push({
        key: "single",
        title: `${t("tripBooking.step1.singleRoom", "Single Room")} - Garden View`,
        subtitle: getRoomSubtitle("single"),
        displayPrice: formatCurrency(baseSeason.singlePrices || baseSeason.single),
        priceUnit: `/ ${t("hotelBooking.roomDates.person", "person")}`,
        defaultOptionValue: "garden",
        options,
      });
    }
    if (baseSeason.double > 0) {
      groups.push({
        key: "double",
        title: `${t("tripBooking.step1.doubleRoom", "Double Room")} - Garden View`,
        subtitle: getRoomSubtitle("double"),
        displayPrice: formatCurrency(baseSeason.doublePrices || baseSeason.double),
        priceUnit: `/ ${t("hotelBooking.roomDates.person", "person")}`,
        defaultOptionValue: "garden",
        options,
      });
    }
    if (baseSeason.triple > 0) {
      groups.push({
        key: "triple",
        title: `${t("tripBooking.step1.tripleRoom", "Triple Room")} - Garden View`,
        subtitle: getRoomSubtitle("triple"),
        displayPrice: formatCurrency(baseSeason.triplePrices || baseSeason.triple),
        priceUnit: `/ ${t("hotelBooking.roomDates.person", "person")}`,
        defaultOptionValue: "garden",
        options,
      });
    }
    return groups;
  }, [trip, formatCurrency, t, isGroupTrip, formData.startDate]);

  const hasFixedAvailability = Boolean(
    trip?.availability && trip.availability.length > 0
  );
  const isFixedDates = Boolean(isGroupTrip || hasFixedAvailability);

  const allSlots = useMemo(() => trip?.availability || [], [trip?.availability]);
  const DEPARTURE_MONTHS = useMemo(() => {
    if (!isFixedDates) return [];
    const monthGroups = Array.from(
      new Set(
        allSlots.map((slot) => {
          const firstDate = (slot.dates || "").split(" - ")[0];
          const d = new Date(firstDate);
          if (isNaN(d.getTime())) return null;
          return d.toLocaleString("default", { month: "long", year: "numeric" });
        }).filter(Boolean)
      )
    ) as string[];

    return monthGroups.map((m) => ({ label: m, value: m }));
  }, [allSlots, isFixedDates]);

  const defaultMonth = DEPARTURE_MONTHS[0]?.value || "";
  const effectiveMonth = formData.departureMonth || defaultMonth;

  useEffect(() => {
    if (isFixedDates && !formData.departureMonth && defaultMonth) {
      onChange({ departureMonth: defaultMonth });
    }
  }, [isFixedDates, formData.departureMonth, defaultMonth, onChange]);

  const availableSlots = useMemo(() => {
    if (!isFixedDates) return [];
    return allSlots.filter((slot) => {
      const firstDate = (slot.dates || "").split(" - ")[0];
      const d = new Date(firstDate);
      if (isNaN(d.getTime())) return true;
      const monthStr = d.toLocaleString("default", { month: "long", year: "numeric" });
      return monthStr === effectiveMonth;
    });
  }, [allSlots, effectiveMonth, isFixedDates]);

  useEffect(() => {
    if (isFixedDates && availableSlots.length > 0) {
      const isValidCurrentId = availableSlots.some((slot) => slot.id?.toString() === formData.departureDateId || slot.dates === formData.departureDateId);
      if (!isValidCurrentId) {
        const first = availableSlots[0];
        onChange({
          departureDateId: first.id?.toString() || first.dates,
          startDate: (first.dates || "").split(" - ")[0]?.trim() || "",
          endDate: (first.dates || "").split(" - ")[1]?.trim() || "",
        });
      }
    }
  }, [isFixedDates, availableSlots, formData.departureDateId, onChange]);

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = t("errors.nameRequired", "Name is required.");
    if (!formData.email?.trim()) {
      newErrors.email = t("errors.emailRequired", "Email is required.");
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t("errors.emailInvalid", "Please enter a valid email address.");
    }

    const phoneDigits = (formData.phone || "").replace(/^(\+\d+\s*)/, "").replace(/\D/g, "");
    if (!formData.phone?.trim() || phoneDigits.length === 0) {
      newErrors.phone = t("errors.phoneRequired", "Phone number is required.");
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = t("errors.phoneInvalid", "The phone number entered is not valid.");
    }

    if (!formData.nationality?.trim()) newErrors.nationality = t("errors.nationalityRequired", "Nationality is required.");
    
    if (isFixedDates) {
      if (!formData.departureDateId) {
        newErrors.departureDateId = t("tripBooking.step1.chooseDepartureError", "Please choose a departure date.");
      }
    } else {
      if (!formData.startDate) {
        newErrors.startDate = t("errors.startDateRequired", "Start date is required.");
      }
    }

    if (!formData.adults || formData.adults < 1) {
      newErrors.adults = t("planYourTrip.travelerInfo.adultsRequired", "At least 1 adult is required.");
    }

    let totalCapacity = 0;
    let totalRoomCount = 0;
    roomGroups.forEach((group) => {
      const c = formData.rooms[group.key] || 0;
      totalRoomCount += c;
      const k = group.key.toLowerCase();
      if (k.includes("single")) totalCapacity += c * 1;
      else if (k.includes("double") || k.includes("twin")) totalCapacity += c * 2;
      else if (k.includes("triple")) totalCapacity += c * 3;
      else if (k.includes("quad")) totalCapacity += c * 4;
      else totalCapacity += c * 2; // fallback
    });

    if (totalRoomCount === 0) {
      newErrors.rooms = t("hotelBooking.roomDates.roomsRequired", "Please select at least one room.");
    } else if (formData.adults > totalCapacity) {
      newErrors.rooms = `${t("hotelBooking.roomDates.roomCapacityExceeded", "Selected rooms only accommodate")} ${totalCapacity} ${t("hotelBooking.roomDates.adults", "adults")}, ${t("hotelBooking.roomDates.butSelected", "but")} ${formData.adults} ${t("hotelBooking.roomDates.adultsSelected", "adults are booked")}.`;
    }

    if (formData.children > 0) {
      const ages = formData.childrenAges || [];
      if (ages.length !== formData.children || ages.some((a) => a == null || a <= 0)) {
        newErrors.childrenAges = "Please select the age for each child.";
      }

      const assigned = formData.childRoomPricing || [];
      const singleAssigned = assigned.filter((r) => r.toLowerCase().includes("single")).length;
      const doubleAssigned = assigned.filter((r) => r.toLowerCase().includes("double")).length;
      const tripleAssigned = assigned.filter((r) => r.toLowerCase().includes("triple")).length;

      const singleCount = formData.rooms?.single || 0;
      const doubleCount = formData.rooms?.double || 0;
      const tripleCount = formData.rooms?.triple || 0;

      if (singleAssigned > singleCount * ROOM_TYPE_CHILD_CAPACITY.single) {
        newErrors.childPricing = singleCount === 0
          ? "You have children assigned to a Single room, but no Single room is selected."
          : "Single rooms can only accommodate up to 2 children per room.";
      } else if (doubleAssigned > doubleCount * ROOM_TYPE_CHILD_CAPACITY.double) {
        newErrors.childPricing = doubleCount === 0
          ? "You have children assigned to a Double room, but no Double room is selected."
          : "Double rooms can only accommodate up to 2 children per room.";
      } else if (tripleAssigned > tripleCount * ROOM_TYPE_CHILD_CAPACITY.triple) {
        newErrors.childPricing = tripleCount === 0
          ? "You have children assigned to a Triple room, but no Triple room is selected."
          : "Triple rooms can only accommodate up to 1 child per room.";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onContinue();
    }
  };

  const handleCountChange = (key: string, count: number, defaultOption: string) => {
    const updatedRooms = {
      single: formData.rooms?.single ?? 0,
      double: formData.rooms?.double ?? 0,
      triple: formData.rooms?.triple ?? 0,
      [key]: count,
    };
    
    const updatedCustomizations = { ...formData.roomCustomizations };
    if (!updatedCustomizations[key]) {
      updatedCustomizations[key] = [];
    }
    
    const currentCustomizations = updatedCustomizations[key];
    if (count > currentCustomizations.length) {
      const diff = count - currentCustomizations.length;
      updatedCustomizations[key] = [...currentCustomizations, ...Array(diff).fill(defaultOption)];
    } else if (count < currentCustomizations.length) {
      updatedCustomizations[key] = currentCustomizations.slice(0, count);
    }
    
    onChange({ rooms: updatedRooms, roomCustomizations: updatedCustomizations });
  };

  const handleCustomizationChange = (key: string, index: number, value: string) => {
    const updatedCustomizations = { ...formData.roomCustomizations };
    if (!updatedCustomizations[key]) updatedCustomizations[key] = [];
    const arr = [...updatedCustomizations[key]];
    arr[index] = value;
    updatedCustomizations[key] = arr;
    onChange({ roomCustomizations: updatedCustomizations });
  };

  const handleGuestChange = (guestType: "adults" | "children" | "infants", increment: boolean) => {
    if (errors.adults && guestType === "adults") setErrors((e) => ({ ...e, adults: "" }));
    if (errors.rooms) setErrors((e) => ({ ...e, rooms: "" }));
    const newCount = Math.max(0, formData[guestType] + (increment ? 1 : -1));
    const patch: Partial<BookingData> = { [guestType]: newCount };

    if (guestType === "children") {
      const currentAges = [...(formData.childrenAges || [])];
      const currentPricing = [...(formData.childRoomPricing || [])];
      const validRoomTypes: string[] = [];
      if ((formData.rooms?.single || 0) > 0) validRoomTypes.push("single");
      if ((formData.rooms?.double || 0) > 0) validRoomTypes.push("double");
      if ((formData.rooms?.triple || 0) > 0) validRoomTypes.push("triple");
      const fallbackRoom = validRoomTypes[0] || "double";

      if (newCount > currentAges.length) {
        for (let i = currentAges.length; i < newCount; i++) {
          currentAges.push(0);
          currentPricing.push(fallbackRoom);
        }
      } else if (newCount < currentAges.length) {
        currentAges.length = newCount;
        currentPricing.length = newCount;
      }
      patch.childrenAges = currentAges;
      patch.childRoomPricing = currentPricing;
    }

    onChange(patch);
  };

  const childRoomOptions = useMemo(() => {
    const opts: Array<{ label: string; value: string }> = [];
    const rooms = formData.rooms || {};

    const getLocalizedRoomTitle = (type: "single" | "double" | "triple") => {
      if (type === "single") return t("tripBooking.step1.singleRoom", "Single Room");
      if (type === "triple") return t("tripBooking.step1.tripleRoom", "Triple Room");
      return t("tripBooking.step1.doubleRoom", "Double Room");
    };

    const getViewLabel = (opt: string) => {
      const v = (opt || "").toLowerCase();
      if (v.includes("sea")) return t("hotelBooking.roomDates.views.sea", "Sea View");
      if (v.includes("pool")) return t("hotelBooking.roomDates.views.pool", "Pool View");
      return t("hotelBooking.roomDates.views.garden", "Garden View");
    };

    const getCanonicalView = (opt: string) => {
      const v = (opt || "").toLowerCase();
      if (v.includes("sea")) return "Sea View";
      if (v.includes("pool")) return "Pool View";
      return "Garden View";
    };

    (["single", "double", "triple"] as const).forEach((type) => {
      const count = rooms[type] || 0;
      if (count <= 0) return;
      const customizations = formData.roomCustomizations?.[type] || [];

      // Collect all distinct views chosen for this room type, preserving order
      const seenViews = new Set<string>();
      for (let i = 0; i < count; i++) {
        const canonical = getCanonicalView(customizations[i] || "garden");
        if (!seenViews.has(canonical)) {
          seenViews.add(canonical);
          const roomTitle = getLocalizedRoomTitle(type);
          const localizedView = getViewLabel(customizations[i] || "garden");
          opts.push({
            label: `${roomTitle} - ${localizedView}`,
            value: `${type}:${canonical}`,
          });
        }
      }
    });

    if (opts.length === 0) {
      opts.push({
        label: `${t("tripBooking.step1.doubleRoom", "Double Room")} - ${t("hotelBooking.roomDates.views.garden", "Garden View")}`,
        value: "double:Garden View",
      });
    }
    return opts;
  }, [formData.rooms, formData.roomCustomizations, t]);

  // Auto-sync childRoomPricing whenever selected rooms change
  useEffect(() => {
    if (!formData.children || formData.children <= 0) return;
    if (childRoomOptions.length === 0) return;

    const validValues = childRoomOptions.map((o) => o.value);
    const currentPricing = formData.childRoomPricing || [];
    let changed = false;
    const nextPricing = Array.from({ length: formData.children }).map((_, i) => {
      const current = currentPricing[i];
      if (current) {
        if (validValues.includes(current)) {
          return current;
        }
        const matchingByPrefix = validValues.find(
          (v) => normalizeRoomType(v) === normalizeRoomType(current)
        );
        if (matchingByPrefix) {
          changed = true;
          return matchingByPrefix;
        }
      }
      changed = true;
      return validValues[0];
    });

    if (changed || nextPricing.length !== currentPricing.length) {
      onChange({ childRoomPricing: nextPricing });
    }
  }, [childRoomOptions, formData.children, onChange]);

  const handleChildAgeChange = (index: number, ageVal: string) => {
    const current = [...(formData.childrenAges || [])];
    current[index] = Number(ageVal);
    onChange({ childrenAges: current });
  };

  const handleChildRoomChange = (index: number, roomVal: string) => {
    const current = [...(formData.childRoomPricing || [])];
    current[index] = roomVal;
    onChange({ childRoomPricing: current });
  };

  const flatCustomizations: Record<string, string> = useMemo(() => {
    const res: Record<string, string> = {};
    Object.entries(formData.roomCustomizations || {}).forEach(([key, arr]) => {
      arr.forEach((val, i) => {
        res[`${key}-${i}`] = val;
      });
    });
    return res;
  }, [formData.roomCustomizations]);

  return (
    <div className={planPage.stepFormCard}>
      <header className={planPage.stepFormCardHeader}>
        <div className={planPage.formHeaderColumn}>
          <h2 className={planPage.formTitle}>{t("tripBooking.step1.title", "Enter Your Information")}</h2>
          <p className={planPage.formSubtitle}>{t("tripBooking.step1.subtitle", "Complete the form below to move to booking confirmation.")}</p>
        </div>
      </header>

      <div className={planPage.stepFormCardScroll}>
        <div className={planPage.formGrid}>
          <FormField
            id="pti-name"
            name="name"
            autoComplete="name"
            label={t("tripBooking.step2.fullName", "Enter your Name")}
            className={planPage.formInput}
            type="text"
            placeholder={t("tripBooking.step2.namePlaceholder", "John Doe")}
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            required
            error={errors.name}
          />

          <FormField
            id="pti-email"
            name="email"
            autoComplete="email"
            label={t("tripBooking.step2.email", "Enter your E-mail")}
            className={planPage.formInput}
            type="email"
            placeholder={t("tripBooking.step2.emailPlaceholder", "example@gmail.com")}
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            required
            error={errors.email}
          />

          <FormField
            id="pti-phone"
            label={t("tripBooking.step2.phone", "Phone Number")}
            required
            error={errors.phone}
          >
            <PhoneInput
              id="pti-phone"
              name="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={(val) => onChange({ phone: val })}
              hasError={!!errors.phone}
            />
          </FormField>

          <FormField label={t("tripBooking.step2.nationality", "Select Your Nationality")} required error={errors.nationality}>
            <NationalitySelect
              value={formData.nationality}
              onChange={(val) => onChange({ nationality: val })}
              error={!!errors.nationality}
            />
          </FormField>

          {isFixedDates ? (
            <div className={planPage.formGroupFull}>
              <div className={stepStyles.groupSection}>
                <FormField
                  id="pti-group-departure-month"
                  label={t("tripBooking.step1.selectMonth", "Select Month")}
                  required
                >
                  <div className={stepStyles.monthSelectDropdownWrapper}>
                    <SelectDropdown
                      id="pti-group-departure-month"
                      options={DEPARTURE_MONTHS}
                      value={effectiveMonth}
                      onChange={(val) => onChange({ departureMonth: val, departureDateId: "" })}
                      renderValue={(val) => (
                        <span className={stepStyles.calendarSelectValue}>
                          <Image src="/images/calendar3.svg" alt="" width={20} height={20} />
                          <span className={stepStyles.calendarText}>{val}</span>
                        </span>
                      )}
                    />
                  </div>
                </FormField>

                <FormField label={t("tripBooking.step1.chooseDepartureDate", "Choose Departure Date")} required error={errors.departureDateId}>
                  <div className={stepStyles.departureGrid}>
                    {(() => {
                      const formatDateRange = (datesStr: string) => {
                        const parts = datesStr.split(" - ");
                        if (parts.length !== 2) return datesStr;
                        const d1 = new Date(parts[0]);
                        const d2 = new Date(parts[1]);
                        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return datesStr;
                        const m1 = d1.toLocaleString("default", { month: "short" });
                        const m2 = d2.toLocaleString("default", { month: "short" });
                        if (d1.getFullYear() !== d2.getFullYear()) {
                          return `${m1} ${d1.getDate()}, ${d1.getFullYear()} - ${m2} ${d2.getDate()}, ${d2.getFullYear()}`;
                        }
                        if (m1 === m2) {
                          return `${m1} ${d1.getDate()}-${d2.getDate()}, ${d1.getFullYear()}`;
                        }
                        return `${m1} ${d1.getDate()} - ${m2} ${d2.getDate()}, ${d1.getFullYear()}`;
                      };

                      return availableSlots.length > 0 ? availableSlots.map((dep) => {
                        const isSelected = formData.departureDateId === dep.id?.toString();
                        return (
                          <div
                            key={dep.id || dep.dates}
                            className={`${stepStyles.departureCard} ${isSelected ? stepStyles.departureSelected : ''}`}
                            onClick={() => onChange({ 
                              departureDateId: dep.id?.toString() || dep.dates,
                              startDate: (dep.dates || "").split(" - ")[0]?.trim() || "",
                              endDate: (dep.dates || "").split(" - ")[1]?.trim() || "",
                            })}
                          >
                            <div className={stepStyles.departureInfo}>
                              <span className={stepStyles.departureDate}>{formatDateRange(dep.dates)}</span>
                              <span className={stepStyles.departureDuration}>{dep.duration}</span>
                            </div>
                            <CheckboxIndicator variant="square" size="md" selected={isSelected} aria-hidden />
                          </div>
                        );
                      }) : (
                        <p className={stepStyles.noDatesMessage}>No departure dates available for this month.</p>
                      );
                    })()}
                  </div>
                </FormField>
              </div>
            </div>
          ) : (
            <>
              <FormField label={t("tripBooking.step1.startDate", "Start Date")} required error={errors.startDate}>
                <CustomDatePicker
                  variant="input"
                  className={`${formStyles.input} ${planPage.dateInput} ${errors.startDate ? formStyles.inputInvalid : ""}`}
                  value={formData.startDate}
                  onChange={(date) => {
                    const updates: Partial<BookingData> = { startDate: date };
                    if (date && trip?.duration?.days) {
                      const d = new Date(date);
                      d.setDate(d.getDate() + trip.duration.days);
                      updates.endDate = d.toISOString().split("T")[0];
                    }
                    onChange(updates);
                  }}
                />
              </FormField>

              <FormField label={t("tripBooking.step1.endDate", "End Date")} required>
                <div className={stepStyles.disabledWrapper}>
                  <CustomDatePicker
                    variant="input"
                    className={`${formStyles.input} ${planPage.dateInput}`}
                    value={formData.endDate}
                    onChange={() => {}}
                  />
                </div>
              </FormField>
            </>
          )}
        </div>

        <hr className={stepStyles.divider} aria-hidden="true" />

        <div className={planPage.formGrid}>
          {(["adults", "children", "infants"] as const).map((type) => {
            const meta = {
              adults: { title: t("planYourTrip.travelerInfo.adults", "No of Adults"), hint: t("planYourTrip.travelerInfo.adultsHint", "( +12 years )") },
              children: { title: t("planYourTrip.travelerInfo.children", "No of Children"), hint: t("planYourTrip.travelerInfo.childrenHint", "( 2 to 11 years )") },
              infants: { title: t("planYourTrip.travelerInfo.infants", "No of Infants"), hint: t("planYourTrip.travelerInfo.infantsHint", "( 0 to 2 years )") },
            };
            return (
              <div key={type} className={planPage.formGroup}>
                <CounterPill
                  label={meta[type].title}
                  subLabel={meta[type].hint}
                  value={formData[type]}
                  onIncrease={() => handleGuestChange(type, true)}
                  onDecrease={() => handleGuestChange(type, false)}
                  required={type === "adults"}
                  error={type === "adults" ? !!errors.adults : undefined}
                />
                {type === "adults" && errors.adults && (
                  <div className={`${formStyles.errorMessage} ${stepStyles.errorMarginTop}`}>
                    <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                    <span>{errors.adults}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Dynamic Child Age Selectors ── */}
        {formData.children > 0 && (
          <div className={stepStyles.childAgesGrid}>
            {Array.from({ length: formData.children }).map((_, i) => {
              const currentAge = formData.childrenAges?.[i] != null && formData.childrenAges[i] > 0 
                ? String(formData.childrenAges[i]) 
                : "";
              return (
                <div key={`child-age-${i}`} className={stepStyles.childPricingItem}>
                  <label className={stepStyles.childPricingLabel}>
                    Child {i + 1}
                  </label>
                  <SelectDropdown
                    id={`child-age-select-${i}`}
                    placeholder="Select Age"
                    options={CHILD_AGE_OPTIONS}
                    value={currentAge}
                    onChange={(val) => handleChildAgeChange(i, val)}
                  />
                </div>
              );
            })}
          </div>
        )}
        {errors.childrenAges && (
          <div className={`${formStyles.errorMessage} ${stepStyles.errorMarginAges}`}>
            <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
            <span>{errors.childrenAges}</span>
          </div>
        )}

        <hr className={stepStyles.divider} aria-hidden="true" />

        <RoomSelector
          required
          rooms={roomGroups}
          counts={formData.rooms}
          customizations={flatCustomizations}
          onCountChange={handleCountChange}
          onCustomizationChange={handleCustomizationChange}
          error={errors.rooms}
          emptyMessage={t("hotelBooking.roomDates.noRooms", "No rooms found for this trip.")}
        />

        {/* ── Child Room Pricing * ── */}
        {formData.children > 0 && (
          <div className={stepStyles.childPricingSection}>
            <hr className={stepStyles.divider} aria-hidden="true" />
            <h3 className={`${stepStyles.sectionTitle} ${stepStyles.childPricingTitle}`}>
              Child Room Pricing <span className={stepStyles.requiredStar}>*</span>
            </h3>
            <div className={stepStyles.childPricingGrid}>
              {Array.from({ length: formData.children }).map((_, i) => {
                const childAge = formData.childrenAges?.[i] != null && formData.childrenAges[i] > 0 
                  ? formData.childrenAges[i] 
                  : null;
                const rawAssigned = formData.childRoomPricing?.[i];
                const assignedRoom =
                  childRoomOptions.find((o) => o.value === rawAssigned)?.value ||
                  childRoomOptions.find((o) => normalizeRoomType(o.value) === normalizeRoomType(rawAssigned))?.value ||
                  childRoomOptions[0]?.value ||
                  "double:Garden View";
                const labelText = childAge ? `Child ${i + 1} - ( ${childAge} years )` : `Child ${i + 1}`;
                return (
                  <div key={`child-room-${i}`} className={stepStyles.childPricingItem}>
                    <label className={stepStyles.childPricingLabel}>
                      {labelText}
                    </label>
                    <SelectDropdown
                      id={`child-room-select-${i}`}
                      options={childRoomOptions}
                      value={assignedRoom}
                      onChange={(val) => handleChildRoomChange(i, val)}
                    />
                  </div>
                );
              })}
            </div>
            {errors.childPricing && (
              <div className={`${formStyles.errorMessage} ${stepStyles.errorMarginTop8}`}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                <span>{errors.childPricing}</span>
              </div>
            )}
          </div>
        )}

        <hr className={stepStyles.divider} aria-hidden="true" />

        <div className={planPage.formGroupFull}>
          <h3 className={stepStyles.sectionTitle}>{t("hotelBooking.personalInfo.specialRequests", "Special Requests (Optional)")}</h3>
          <FormField
            id="pti-details"
            label=""
            isTextarea
            wrapperClassName={planPage.formGroupFull}
            className={travelerStyles.formTextarea}
            placeholder={t("hotelBooking.personalInfo.specialRequestsPlaceholder", "Any special requirements or requests for your trip...")}
            value={formData.specialRequests}
            onChange={(e) => onChange({ specialRequests: e.target.value })}
            rows={4}
          />
        </div>
      </div>

      <BookingStepFooter
        onContinue={handleNext}
      />
    </div>
  );
}
