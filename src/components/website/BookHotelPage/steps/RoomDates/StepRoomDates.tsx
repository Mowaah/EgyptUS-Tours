import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import {
  BookingStepFooter,
  FormField,
  CustomDatePicker,
  SelectDropdown,
  CounterPill,
  CategoryTabs,
} from "@/components/shared";
import type { SelectOption } from "@/components/shared";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getRoomSubtitle, normalizeRoomType, ROOM_TYPE_CHILD_CAPACITY } from "@/utils/bookingPricing";
import planPage from "../../../PlanYourTripPage/PlanYourTripPage.module.scss";
import travelerStyles from "../../../PlanYourTripPage/steps/TravelerInfo/StepTravelerInfo.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import styles from "./StepRoomDates.module.scss";
import { BookingData } from "../../BookHotelPage";
import { Hotel, HotelRoom } from "@/types";

interface StepRoomDatesProps {
  formData: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
  onContinue: () => void;
  onPrevious?: () => void;
  hotel: Hotel;
}

const PREFERRED_CAT_ORDER = ["Standard", "Deluxe", "Premium", "Suite", "Executive"];
const PREFERRED_VIEW_ORDER = ["Garden", "Sea", "Pool", "City", "Nile", "Courtyard"];

function cleanCategoryName(cat?: string): string {
  if (!cat) return "Standard";
  const trimmed = cat.trim();
  const stripped = trimmed.replace(/\s+room$/i, "").trim();
  return stripped ? stripped.charAt(0).toUpperCase() + stripped.slice(1) : "Standard";
}

function cleanViewName(vw?: string): string {
  if (!vw) return "Garden";
  const trimmed = vw.trim();
  const stripped = trimmed.replace(/\s+view$/i, "").trim();
  return stripped ? stripped.charAt(0).toUpperCase() + stripped.slice(1) : "Garden";
}

function matchesCategory(room: HotelRoom, categoryName: string): boolean {
  if (!categoryName) return true;
  const target = cleanCategoryName(categoryName).toLowerCase();
  const roomCat = cleanCategoryName(room.category).toLowerCase();
  return roomCat === target || roomCat.includes(target) || target.includes(roomCat);
}

function matchesView(room: HotelRoom, viewName: string): boolean {
  if (!viewName) return true;
  const target = cleanViewName(viewName).toLowerCase();
  const roomVw = cleanViewName(room.view).toLowerCase();
  return roomVw === target || roomVw.includes(target) || target.includes(roomVw);
}

const CHILD_AGE_OPTIONS: SelectOption[] = Array.from({ length: 10 }, (_, i) => ({
  label: `${i + 2} years`,
  value: String(i + 2),
}));

export default function StepRoomDates({
  formData,
  onChange,
  onContinue,
  onPrevious,
  hotel,
}: StepRoomDatesProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation("booking");

  // Only categories that actually exist in the hotel
  const availableCategories = useMemo(() => {
    const all = hotel.hotelRooms || [];
    if (all.length === 0) return ["Standard"];
    const unique = Array.from(
      new Set(all.map((r) => cleanCategoryName(r.category)).filter(Boolean))
    );
    return unique.sort((a, b) => {
      const idxA = PREFERRED_CAT_ORDER.indexOf(a);
      const idxB = PREFERRED_CAT_ORDER.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [hotel.hotelRooms]);

  const selectedCategory = useMemo(() => {
    if (formData.roomCategory) {
      const target = formData.roomCategory.toLowerCase();
      const match = availableCategories.find((c) => c.toLowerCase() === target);
      if (match) return match;
    }
    return availableCategories[0] || "Standard";
  }, [formData.roomCategory, availableCategories]);

  // Only views that actually exist for the selected category
  const availableViews = useMemo(() => {
    const all = hotel.hotelRooms || [];
    if (all.length === 0) return ["Garden", "Sea", "Pool"];
    const catRooms = all.filter((r) => matchesCategory(r, selectedCategory));
    const roomsToUse = catRooms.length > 0 ? catRooms : all;
    const unique = Array.from(
      new Set(roomsToUse.map((r) => cleanViewName(r.view)).filter(Boolean))
    );
    return unique.sort((a, b) => {
      const idxA = PREFERRED_VIEW_ORDER.indexOf(a);
      const idxB = PREFERRED_VIEW_ORDER.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [hotel.hotelRooms, selectedCategory]);

  const selectedView = useMemo(() => {
    if (formData.roomView) {
      const target = formData.roomView.toLowerCase();
      const match = availableViews.find((v) => v.toLowerCase() === target);
      if (match) return match;
    }
    return availableViews[0] || "Garden";
  }, [formData.roomView, availableViews]);

  // Keep formData in sync whenever category or view resolves
  useEffect(() => {
    const patch: Partial<BookingData> = {};
    if (formData.roomCategory !== selectedCategory) {
      patch.roomCategory = selectedCategory;
    }
    if (formData.roomView !== selectedView) {
      patch.roomView = selectedView;
    }
    if (Object.keys(patch).length > 0) {
      onChange(patch);
    }
  }, [formData.roomCategory, formData.roomView, selectedCategory, selectedView, onChange]);

  const activeCategoryIndex = useMemo(() => {
    const idx = availableCategories.findIndex((c) => c.toLowerCase() === selectedCategory.toLowerCase());
    return idx >= 0 ? idx : 0;
  }, [availableCategories, selectedCategory]);

  const activeViewIndex = useMemo(() => {
    const idx = availableViews.findIndex((v) => v.toLowerCase() === selectedView.toLowerCase());
    return idx >= 0 ? idx : 0;
  }, [availableViews, selectedView]);

  const handleCategoryChange = (tab: string) => {
    const cleanCat = cleanCategoryName(tab);
    const allRooms = hotel.hotelRooms || [];
    const viewsForNewCat = Array.from(
      new Set(
        allRooms
          .filter((r) => matchesCategory(r, cleanCat))
          .map((r) => cleanViewName(r.view))
          .filter(Boolean)
      )
    );

    let nextView = selectedView;
    if (viewsForNewCat.length > 0 && !viewsForNewCat.some((v) => v.toLowerCase() === selectedView.toLowerCase())) {
      nextView = viewsForNewCat[0];
    }

    onChange({
      roomCategory: cleanCat,
      roomView: nextView,
    });
  };

  const handleViewChange = (tab: string) => {
    onChange({ roomView: cleanViewName(tab) });
  };

  // Rooms matching the exact selected category and view
  const matchingRooms: HotelRoom[] = useMemo(() => {
    const all = hotel.hotelRooms || [];
    if (all.length === 0) {
      const viewTitle = `${cleanViewName(selectedView)} View`;
      return [
        {
          id: `synth-single-${selectedView.toLowerCase()}`,
          name: "Single Room",
          type: "Single Room",
          category: selectedCategory,
          view: viewTitle,
          pricePerNight: hotel.pricePerNight || 100,
          prices: hotel.prices,
          description: "",
          images: [],
          features: [],
        },
        {
          id: `synth-double-${selectedView.toLowerCase()}`,
          name: "Double Room",
          type: "Double Room",
          category: selectedCategory,
          view: viewTitle,
          pricePerNight: hotel.pricePerNight || 100,
          prices: hotel.prices,
          description: "",
          images: [],
          features: [],
        },
        {
          id: `synth-triple-${selectedView.toLowerCase()}`,
          name: "Triple Room",
          type: "Triple Room",
          category: selectedCategory,
          view: viewTitle,
          pricePerNight: hotel.pricePerNight || 100,
          prices: hotel.prices,
          description: "",
          images: [],
          features: [],
        },
      ];
    }

    return all.filter((r) => matchesCategory(r, selectedCategory) && matchesView(r, selectedView));
  }, [hotel.hotelRooms, hotel.pricePerNight, hotel.prices, selectedCategory, selectedView]);

  const handleRoomCountChange = (room: HotelRoom, increment: boolean) => {
    const typeKey = normalizeRoomType(room.type);
    const currentCustom = formData.roomCustomizations?.[typeKey] || [];
    const nextCustom = [...currentCustom];

    if (increment) {
      nextCustom.push(room.id);
    } else {
      const idx = nextCustom.lastIndexOf(room.id);
      if (idx >= 0) {
        nextCustom.splice(idx, 1);
      } else if (nextCustom.length > 0) {
        nextCustom.pop();
      }
    }

    const newRooms = {
      ...formData.rooms,
      [typeKey]: nextCustom.length,
    };

    if (errors.rooms) setErrors((e) => ({ ...e, rooms: "" }));

    onChange({
      rooms: newRooms,
      roomCustomizations: {
        ...(formData.roomCustomizations || {}),
        [typeKey]: nextCustom,
      },
    });
  };

  const handleGuestChange = (type: "adults" | "children" | "infants", increment: boolean) => {
    if (errors.adults && type === "adults") setErrors((e) => ({ ...e, adults: "" }));
    if (errors.rooms) setErrors((e) => ({ ...e, rooms: "" }));
    const newCount = Math.max(0, formData[type] + (increment ? 1 : -1));
    const patch: Partial<BookingData> = { [type]: newCount };

    if (type === "children") {
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

  // Build room dropdown options for Child Room Pricing
  const childRoomOptions: SelectOption[] = useMemo(() => {
    const opts: SelectOption[] = [];
    const rooms = formData.rooms || {};
    const allRooms = hotel.hotelRooms || [];

    const getLocalizedRoomTitle = (type: "single" | "double" | "triple") => {
      if (type === "single") return t("tripBooking.step1.singleRoom", "Single Room");
      if (type === "triple") return t("tripBooking.step1.tripleRoom", "Triple Room");
      return t("tripBooking.step1.doubleRoom", "Double Room");
    };

    const seenKeys = new Set<string>();
    (["single", "double", "triple"] as const).forEach((type) => {
      const count = rooms[type] || 0;
      if (count <= 0) return;
      const customizations = formData.roomCustomizations?.[type] || [];
      for (let i = 0; i < count; i++) {
        const customId = customizations[i];
        const found = allRooms.find((r) => r.id === customId);
        const viewName = found?.view ? cleanViewName(found.view) : cleanViewName(selectedView);
        const key = `${type}:${viewName}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          const roomTitle = getLocalizedRoomTitle(type);
          opts.push({
            label: `${roomTitle} - ${viewName} View`,
            value: key,
          });
        }
      }
    });

    if (opts.length === 0) {
      opts.push({
        label: `${t("tripBooking.step1.doubleRoom", "Double Room")} - ${cleanViewName(selectedView)} View`,
        value: `double:${cleanViewName(selectedView)}`,
      });
    }
    return opts;
  }, [formData.rooms, formData.roomCustomizations, hotel.hotelRooms, selectedView, t]);

  // Auto-sync childRoomPricing whenever selected rooms change
  useEffect(() => {
    if (!formData.children || formData.children <= 0) return;
    if (childRoomOptions.length === 0) return;

    const validValues = childRoomOptions.map((o) => o.value);
    const currentPricing = formData.childRoomPricing || [];
    let changed = false;
    const nextPricing = Array.from({ length: formData.children }).map((_, i) => {
      const current = currentPricing[i];
      if (current && validValues.includes(current)) {
        return current;
      }
      const matchByType = current && childRoomOptions.find((o) => normalizeRoomType(o.value) === normalizeRoomType(current));
      if (matchByType) {
        changed = true;
        return matchByType.value;
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

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.startDate) newErrors.startDate = t("hotelBooking.roomDates.checkInRequired", "Check-in date is required.");
    if (!formData.endDate) newErrors.endDate = t("hotelBooking.roomDates.checkOutRequired", "Check-out date is required.");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (formData.startDate) {
      const checkInDate = new Date(formData.startDate);
      checkInDate.setHours(0, 0, 0, 0);
      if (checkInDate < today) {
        newErrors.startDate = t("hotelBooking.roomDates.checkInPast", "Check-in date cannot be in the past.");
      }
    }

    if (formData.startDate && formData.endDate) {
      const checkInDate = new Date(formData.startDate);
      checkInDate.setHours(0, 0, 0, 0);
      const checkOutDate = new Date(formData.endDate);
      checkOutDate.setHours(0, 0, 0, 0);

      if (checkOutDate <= checkInDate) {
        newErrors.endDate = t("hotelBooking.roomDates.checkOutBeforeCheckIn", "Check-out date must be after check-in date.");
      }
    }

    if (!formData.adults || formData.adults < 1) {
      newErrors.adults = t("hotelBooking.roomDates.adultsRequired", "At least 1 adult is required.");
    }

    const singleCount = formData.rooms?.single || 0;
    const doubleCount = formData.rooms?.double || 0;
    const tripleCount = formData.rooms?.triple || 0;
    const totalRooms = singleCount + doubleCount + tripleCount;
    const totalAdultCapacity = singleCount * 1 + doubleCount * 2 + tripleCount * 3;

    if (totalRooms === 0) {
      newErrors.rooms = t("hotelBooking.roomDates.roomsRequired", "Please select at least one room.");
    } else if (formData.adults > totalAdultCapacity) {
      newErrors.rooms = `${t("hotelBooking.roomDates.roomCapacityExceeded", "Selected rooms only accommodate")} ${totalAdultCapacity} ${totalAdultCapacity === 1 ? t("hotelBooking.roomDates.adult", "adult") : t("hotelBooking.roomDates.adults", "adults")}, ${t("hotelBooking.roomDates.butSelected", "but")} ${formData.adults} ${t("hotelBooking.roomDates.adultsSelected", "adults are selected")}.`;
    }

    // Validate child policy
    if (formData.children > 0) {
      const ages = formData.childrenAges || [];
      if (ages.length !== formData.children || ages.some((a) => a == null || a <= 0)) {
        newErrors.childrenAges = "Please select the age for each child.";
      }

      const assigned = formData.childRoomPricing || [];
      const singleAssigned = assigned.filter((r) => r.toLowerCase().includes("single")).length;
      const doubleAssigned = assigned.filter((r) => r.toLowerCase().includes("double")).length;
      const tripleAssigned = assigned.filter((r) => r.toLowerCase().includes("triple")).length;

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onContinue();
  };

  return (
    <div className={planPage.stepFormCard}>
      <header className={planPage.stepFormCardHeader}>
        <div className={planPage.formHeaderColumn}>
          <h2 className={planPage.formTitle}>
            {t("hotelBooking.roomDates.title", "Find the Perfect Room for Your Stay")}
          </h2>
          <p className={planPage.formSubtitle}>
            {t(
              "hotelBooking.roomDates.subtitle",
              "Select your dates, number of guests, and room preferences to find the best option for your stay."
            )}
          </p>
        </div>
      </header>

      <div className={planPage.stepFormCardScroll}>
        {/* ── Dates ── */}
        <div className={planPage.formGrid}>
          <FormField label={t("hotelBooking.roomDates.checkIn", "Check-in")} required error={errors.startDate}>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${planPage.dateInput} ${errors.startDate ? formStyles.inputInvalid : ""}`}
              value={formData.startDate}
              onChange={(date) => {
                onChange({ startDate: date });
                if (errors.startDate) setErrors((e) => ({ ...e, startDate: "" }));
              }}
            />
          </FormField>
          <FormField label={t("hotelBooking.roomDates.checkOut", "Check-out")} required error={errors.endDate}>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${planPage.dateInput} ${errors.endDate ? formStyles.inputInvalid : ""}`}
              value={formData.endDate}
              minDate={formData.startDate ? new Date(formData.startDate) : undefined}
              onChange={(date) => {
                onChange({ endDate: date });
                if (errors.endDate) setErrors((e) => ({ ...e, endDate: "" }));
              }}
            />
          </FormField>
        </div>

        {/* ── Guest Counters ── */}
        <div className={`${planPage.formGrid} ${styles.guestGrid}`}>
          <div className={planPage.formGroup}>
            <CounterPill
              label={t("planYourTrip.travelerInfo.adults", "No of Adults")}
              subLabel={t("planYourTrip.travelerInfo.adultsHint", "(+12 years)")}
              value={formData.adults}
              onIncrease={() => handleGuestChange("adults", true)}
              onDecrease={() => handleGuestChange("adults", false)}
              required
            />
            {errors.adults && (
              <div className={styles.errorText}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} />
                <span>{errors.adults}</span>
              </div>
            )}
          </div>

          <div className={planPage.formGroup}>
            <CounterPill
              label={t("planYourTrip.travelerInfo.children", "No of Children")}
              subLabel={t("planYourTrip.travelerInfo.childrenHint", "( 2 to 11 years)")}
              value={formData.children}
              onIncrease={() => handleGuestChange("children", true)}
              onDecrease={() => handleGuestChange("children", false)}
            />
          </div>

          <div className={planPage.formGroup}>
            <CounterPill
              label={t("planYourTrip.travelerInfo.infants", "No of Infants")}
              subLabel={t("planYourTrip.travelerInfo.infantsHint", "( 0 to 2 years)")}
              value={formData.infants}
              onIncrease={() => handleGuestChange("infants", true)}
              onDecrease={() => handleGuestChange("infants", false)}
            />
          </div>
        </div>

        {/* ── Dynamic Child Age Selectors ── */}
        {formData.children > 0 && (
          <div className={styles.childAgesGrid}>
            {Array.from({ length: formData.children }).map((_, i) => {
              const currentAge = formData.childrenAges?.[i] != null && formData.childrenAges[i] > 0 
                ? String(formData.childrenAges[i]) 
                : "";
              return (
                <div key={`child-age-${i}`} className={styles.childPricingItem}>
                  <label className={styles.childPricingLabel}>
                    Child {i + 1} <span className={styles.requiredStar}>*</span>
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
          <div className={`${styles.errorText} ${styles.errorBottom}`}>
            <Image src="/images/information-fill.svg" alt="" width={16} height={16} />
            <span>{errors.childrenAges}</span>
          </div>
        )}

        {/* ── Filter Pills: Category & View ── */}
        {(availableCategories.length > 0 || availableViews.length > 0) && (
          <div className={`${styles.filterSection} ${styles.filterSectionTop}`}>
            {availableCategories.length > 0 && (
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>
                  {t("hotelBooking.roomDates.roomCategory", "Room Category")}
                </span>
                <CategoryTabs
                  tabs={availableCategories}
                  active={activeCategoryIndex}
                  onTabChange={handleCategoryChange}
                />
              </div>
            )}

            {availableViews.length > 0 && (
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>
                  {t("hotelBooking.roomDates.roomView", "Room View")}
                </span>
                <CategoryTabs
                  tabs={availableViews}
                  active={activeViewIndex}
                  onTabChange={handleViewChange}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Room Cards ── */}
        <div className={styles.roomList}>
          {matchingRooms.length > 0 ? (
            matchingRooms.map((room) => {
              const typeKey = normalizeRoomType(room.type);
              const customIds = formData.roomCustomizations?.[typeKey] || [];
              const count = customIds.filter((id) => id === room.id).length;
              const rawTypeTitle =
                typeKey === "single"
                  ? t("hotelBooking.roomDates.singleRoom", "Single Room")
                  : typeKey === "triple"
                  ? t("hotelBooking.roomDates.tripleRoom", "Triple Room")
                  : t("hotelBooking.roomDates.doubleRoom", "Double Room");
              const viewLabel = cleanViewName(room.view || selectedView);
              const title = `${rawTypeTitle} - ${viewLabel} View`;
              const subtitle = getRoomSubtitle(typeKey);
              const nightlyPrice = room.prices || room.pricePerNight;

              return (
                <div key={room.id} className={styles.roomRowWrapper}>
                  <div className={`${styles.roomInfoBox} ${count > 0 ? styles.selected : ""}`}>
                    <div className={styles.roomTexts}>
                      <span className={styles.roomTitle}>{title}</span>
                      <span className={styles.roomSub}>{subtitle}</span>
                    </div>
                    <div className={styles.priceCol}>
                      <span className={styles.priceVal}>{formatCurrency(nightlyPrice)}</span>
                      <span className={styles.roomSub}>/ {t("hotelBooking.roomDates.person", "person")}</span>
                    </div>
                  </div>
                  <CounterPill
                    value={count}
                    onIncrease={() => handleRoomCountChange(room, true)}
                    onDecrease={() => handleRoomCountChange(room, false)}
                    className={styles.roomCounter}
                    pillOnly
                  />
                </div>
              );
            })
          ) : (
            <div className={styles.emptyRoomsBox}>
              <Image src="/images/information-fill.svg" alt="" width={20} height={20} aria-hidden />
              <div className={styles.emptyRoomsContent}>
                <p className={styles.emptyRoomsTitle}>
                  {t("hotelBooking.roomDates.noRoomsTitle", "No rooms available for this selection")}
                </p>
                <p className={styles.emptyRoomsText}>
                  {t(
                    "hotelBooking.roomDates.noRoomsDescription",
                    "There are no rooms available for the selected category and view. Please select a different category or view."
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
        {errors.rooms && (
          <div className={`${styles.errorText} ${styles.errorBottomRoom}`}>
            <Image src="/images/information-fill.svg" alt="" width={16} height={16} />
            <span>{errors.rooms}</span>
          </div>
        )}

        {/* ── Child Room Pricing * ── */}
        {formData.children > 0 && (
          <div className={styles.childPricingSection}>
            <hr className={styles.divider} aria-hidden="true" />
            <h3 className={`${styles.sectionTitle} ${styles.childPricingTitle}`}>
              Child Room Pricing <span className={styles.requiredStar}>*</span>
            </h3>
            <div className={styles.childPricingGrid}>
              {Array.from({ length: formData.children }).map((_, i) => {
                const childAge = formData.childrenAges?.[i] != null && formData.childrenAges[i] > 0
                  ? formData.childrenAges[i]
                  : null;
                const assignedRoom = formData.childRoomPricing?.[i] || childRoomOptions[0]?.value || "double";
                const labelText = childAge ? `Child ${i + 1} - ( ${childAge} years )` : `Child ${i + 1}`;
                return (
                  <div key={`child-room-${i}`} className={styles.childPricingItem}>
                    <label className={styles.childPricingLabel}>
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
              <div className={styles.errorText}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} />
                <span>{errors.childPricing}</span>
              </div>
            )}
          </div>
        )}

        <hr className={styles.divider} aria-hidden="true" />

        {/* ── Special Requests ── */}
        <h3 className={styles.sectionTitle}>
          {t("hotelBooking.roomDates.specialRequests", "Special Requests (Optional)")}
        </h3>
        <FormField
          id="rd-requests"
          label=""
          isTextarea
          wrapperClassName={planPage.formGroupFull}
          className={travelerStyles.formTextarea}
          placeholder={t(
            "hotelBooking.roomDates.specialRequestsPlaceholder",
            "Any special requirements or requests for your trip..."
          )}
          value={formData.specialRequests}
          onChange={(e) => onChange({ specialRequests: e.target.value })}
          rows={4}
        />
      </div>

      <BookingStepFooter
        onPrevious={onPrevious || (() => window.history.back())}
        onContinue={handleContinue}
      />
    </div>
  );
}
