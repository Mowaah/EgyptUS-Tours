import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";
import { getFullHotelBySlug } from "@/services/hotelsService";
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

interface StepYourDetailsProps {
  trip: Trip;
  formData: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
  onContinue: () => void;
  isGroupTrip?: boolean;
}

export default function StepYourDetails({ trip, formData, onChange, onContinue, isGroupTrip }: StepYourDetailsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tripHotelSlug = trip?.hotels?.[0]?.slug;

  const { data: hotelDetail } = useSWR(
    tripHotelSlug ? `/hotels/${tripHotelSlug}/` : null,
    () => getFullHotelBySlug(tripHotelSlug as string)
  );

  const groupedRooms = useMemo(() => {
    if (!hotelDetail?.hotelRooms) return {};
    const groups: Record<string, typeof hotelDetail.hotelRooms> = {};
    for (const room of hotelDetail.hotelRooms) {
      if (!groups[room.type]) groups[room.type] = [];
      groups[room.type].push(room);
    }
    return groups;
  }, [hotelDetail]);

  const roomGroups: RoomGroup[] = useMemo(() => {
    return Object.entries(groupedRooms).map(([type, rooms]) => {
      const roomList = rooms || [];
      let baseRoom = roomList.find(r => r.view.toLowerCase().includes("garden"));
      if (!baseRoom && roomList.length > 0) {
        baseRoom = roomList.reduce((prev, curr) => (prev.pricePerNight < curr.pricePerNight ? prev : curr));
      }
      const options = roomList.map(r => {
        const isBase = baseRoom ? r.id === baseRoom.id : false;
        const diff = baseRoom ? r.pricePerNight - baseRoom.pricePerNight : 0;
        return {
          label: r.view,
          value: r.id.toString(),
          price: isBase ? "Included" : (diff > 0 ? `+$${diff}` : `-$${Math.abs(diff)}`),
          isFree: isBase,
        };
      });

      const rawTitle = type.trim();
      const title = rawTitle.toLowerCase().endsWith("room")
        ? rawTitle
        : `${rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1)} Room`;

      return {
        key: type.toLowerCase(),
        title,
        subtitle: "1 person",
        displayPrice: `EGP ${baseRoom!.pricePerNight.toLocaleString()}`,
        priceUnit: "/ night",
        options,
        defaultOptionValue: baseRoom!.id.toString(),
      };
    });
  }, [groupedRooms]);

  const hasFixedAvailability = Boolean(
    trip?.availability && trip.availability.length > 0
  );
  const isFixedDates = Boolean(isGroupTrip || hasFixedAvailability);

  const allSlots = trip?.availability || [];
  const DEPARTURE_MONTHS = useMemo(() => {
    if (!isFixedDates) return [];
    const monthGroups = Array.from(
      new Set(
        allSlots.map((slot: any) => {
          const parts = slot.dates.split(" - ");
          const dStr = parts[0] ? parts[0].trim() : slot.dates;
          const d = new Date(dStr);
          if (isNaN(d.getTime())) return "Unknown";
          const m = d.toLocaleString("default", { month: "long" });
          const y = d.getFullYear();
          return `${m} ${y}`;
        })
      )
    ).filter((m) => m !== "Unknown");

    return monthGroups.map((m) => ({ label: m, value: m }));
  }, [allSlots, isFixedDates]);

  const effectiveMonth = formData.departureMonth || (DEPARTURE_MONTHS.length > 0 ? DEPARTURE_MONTHS[0].value : "");

  const availableSlots = useMemo(() => {
    if (!effectiveMonth) return [];
    return allSlots.filter((slot: any) => {
      const parts = slot.dates.split(" - ");
      const dStr = parts[0] ? parts[0].trim() : slot.dates;
      const d = new Date(dStr);
      if (isNaN(d.getTime())) return false;
      const m = d.toLocaleString("default", { month: "long" });
      const y = d.getFullYear();
      return `${m} ${y}` === effectiveMonth;
    });
  }, [allSlots, effectiveMonth]);

  useEffect(() => {
    if (isFixedDates && DEPARTURE_MONTHS.length > 0) {
      const isValid = DEPARTURE_MONTHS.some((m) => m.value === formData.departureMonth);
      if (!formData.departureMonth || !isValid) {
        onChange({ departureMonth: DEPARTURE_MONTHS[0].value, departureDateId: "" });
      }
    }
  }, [isFixedDates, formData.departureMonth, DEPARTURE_MONTHS, onChange]);

  const handleNext = () => {
    let newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required.";
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    const phoneDigits = (formData.phone || "").replace(/^(\+\d+\s*)/, "").replace(/\D/g, "");
    if (!formData.phone?.trim() || phoneDigits.length === 0) {
      newErrors.phone = "Phone number is required.";
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = "The phone number entered is not valid.";
    }

    if (!formData.nationality?.trim()) newErrors.nationality = "Nationality is required.";
    
    if (isFixedDates) {
      if (!formData.departureDateId) {
        newErrors.departureDateId = "Please choose a departure date.";
      }
    } else {
      if (!formData.startDate) {
        newErrors.startDate = "Start date is required.";
      }
    }

    if (!formData.adults || formData.adults < 1) {
      newErrors.adults = "At least 1 adult is required.";
    }

    let totalCapacity = 0;
    let totalRoomCount = 0;
    Object.entries(formData.rooms).forEach(([key, count]) => {
      const c = (count as number) || 0;
      totalRoomCount += c;
      const k = key.toLowerCase();
      if (k.includes("single")) totalCapacity += c * 1;
      else if (k.includes("double")) totalCapacity += c * 2;
      else if (k.includes("triple")) totalCapacity += c * 3;
      else totalCapacity += c * 2; // fallback
    });

    if (totalRoomCount === 0) {
      newErrors.rooms = "Please select at least one room.";
    } else if (formData.adults > totalCapacity) {
      newErrors.rooms = `Selected rooms only accommodate ${totalCapacity} adults, but ${formData.adults} adults are booked.`;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onContinue();
    }
  };

  const handleCountChange = (key: string, count: number, defaultOption: string) => {
    const updatedRooms = { ...formData.rooms, [key]: count };
    
    let updatedCustomizations = { ...formData.roomCustomizations };
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
    
    onChange({ rooms: updatedRooms as any, roomCustomizations: updatedCustomizations });
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
    onChange({
      [guestType]: Math.max(0, formData[guestType] + (increment ? 1 : -1)),
    });
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
          <h2 className={planPage.formTitle}>Enter Your Information</h2>
          <p className={planPage.formSubtitle}>Complete the form below to move to booking confirmation.</p>
        </div>
      </header>

      <div className={planPage.stepFormCardScroll}>
        <div className={planPage.formGrid}>
          <FormField
            id="pti-name"
            name="name"
            autoComplete="name"
            label="Enter your Name"
            className={planPage.formInput}
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            required
            error={errors.name}
          />

          <FormField
            id="pti-email"
            name="email"
            autoComplete="email"
            label="Enter your E-mail"
            className={planPage.formInput}
            type="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            required
            error={errors.email}
          />

          <FormField
            id="pti-phone"
            label="Phone Number"
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

          <FormField label="Select Your Nationality" required error={errors.nationality}>
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
                  label="Select Month"
                  required
                >
                  <div className={stepStyles.monthSelectDropdownWrapper}>
                    <SelectDropdown
                      id="pti-group-departure-month"
                      options={DEPARTURE_MONTHS}
                      value={effectiveMonth}
                      onChange={(val) => onChange({ departureMonth: val, departureDateId: "" })}
                      renderValue={(val) => (
                        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <Image src="/images/calendar3.svg" alt="" width={20} height={20} />
                          <span style={{ color: "#0A0A0A80", fontWeight: 500 }}>{val}</span>
                        </span>
                      )}
                    />
                  </div>
                </FormField>

                <FormField label="Choose Departure Date" required error={errors.departureDateId}>
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

                      return availableSlots.length > 0 ? availableSlots.map((dep: any) => {
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
                        <p style={{ fontSize: "14px", color: "#666" }}>No departure dates available for this month.</p>
                      );
                    })()}
                  </div>
                </FormField>
              </div>
            </div>
          ) : (
            <>
              <FormField label="Start Date" required error={errors.startDate}>
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

              <FormField label="End Date" required>
                <div style={{ pointerEvents: "none", opacity: 0.7 }}>
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
              adults: { title: "No of Adults", hint: "( +12 years )" },
              children: { title: "No of Children", hint: "( 2 to 11 years )" },
              infants: { title: "No of Infants", hint: "( 0 to 2 years )" },
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
                  <div className={formStyles.errorMessage} style={{ marginTop: "4px" }}>
                    <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                    <span>{errors.adults}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <hr className={stepStyles.divider} aria-hidden="true" />

        <RoomSelector
          required
          rooms={roomGroups}
          counts={formData.rooms as Record<string, number>}
          customizations={flatCustomizations}
          onCountChange={handleCountChange}
          onCustomizationChange={handleCustomizationChange}
          error={errors.rooms}
          emptyMessage="No rooms found for this trip."
        />

        <hr className={stepStyles.divider} aria-hidden="true" />

        <div className={planPage.formGroupFull}>
          <h3 className={stepStyles.sectionTitle}>Special Requests (Optional)</h3>
          <FormField
            id="pti-details"
            label=""
            isTextarea
            wrapperClassName={planPage.formGroupFull}
            className={travelerStyles.formTextarea}
            placeholder="Any special requirements or requests for your trip..."
            value={formData.specialRequests}
            onChange={(e) => onChange({ specialRequests: e.target.value })}
            rows={4}
          />
        </div>
      </div>

      <BookingStepFooter
        onContinue={handleNext}
        continueLabel="Continue"
      />
    </div>
  );
}
