import React from "react";
import {
  BookingStepFooter,
  CheckboxIndicator,
  FormField,
  PhonePrefixSelect,
  CustomDatePicker,
  SelectDropdown,
  NationalitySelect,
  CounterPill,
} from "@/components/shared";
import type { SelectOption } from "@/components/shared";

import planPage from "../../../PlanYourTripPage/PlanYourTripPage.module.scss";
import travelerStyles from "../../../PlanYourTripPage/steps/TravelerInfo/StepTravelerInfo.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import stepStyles from "./StepYourDetails.module.scss";
import { BookingData } from "../../BookPrivateTripPage";

const ROOM_VIEW_OPTIONS: SelectOption[] = [
  { label: "Garden View", value: "garden", price: "Free", isFree: true },
  { label: "Nile View", value: "nile", price: "+$ 456" },
  { label: "Sea View", value: "sea", price: "+$ 456" },
];

const GROUP_DEPARTURE_DATES = [
  { id: "1", date: "March 15-19, 2026", duration: "5 Days / 4 Nights" },
  { id: "2", date: "March 15-19, 2026", duration: "5 Days / 4 Nights" },
  { id: "3", date: "March 15-19, 2026", duration: "5 Days / 4 Nights" },
  { id: "4", date: "March 15-19, 2026", duration: "5 Days / 4 Nights" },
  { id: "5", date: "March 15-19, 2026", duration: "5 Days / 4 Nights" },
  { id: "6", date: "March 15-19, 2026", duration: "5 Days / 4 Nights" },
];

interface StepYourDetailsProps {
  formData: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
  onContinue: () => void;
  isGroupTrip?: boolean;
}

export default function StepYourDetails({ formData, onChange, onContinue, isGroupTrip }: StepYourDetailsProps) {
  const handleRoomChange = (roomType: "single" | "double" | "triple", increment: boolean) => {
    onChange({
      rooms: {
        ...formData.rooms,
        [roomType]: Math.max(0, formData.rooms[roomType] + (increment ? 1 : -1)),
      },
    });
  };

  const handleGuestChange = (guestType: "adults" | "children" | "infants", increment: boolean) => {
    onChange({
      [guestType]: Math.max(0, formData[guestType] + (increment ? 1 : -1)),
    });
  };

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
            label="Enter your Name"
            className={planPage.formInput}
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            required
          />

          <FormField
            id="pti-email"
            label="Enter your E-mail"
            className={planPage.formInput}
            type="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            required
          />

          <FormField
            id="pti-phone"
            label="Phone Number"
            required
          >
            <div className={travelerStyles.phoneRow}>
              <PhonePrefixSelect
                phoneValue={formData.phone}
                onPhoneChange={(val) => onChange({ phone: val })}
              />
              <input
                id="pti-phone"
                type="tel"
                className={`${formStyles.input} ${travelerStyles.inputPhone}`}
                value={formData.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="+1 555-0000"
              />
            </div>
          </FormField>

          <FormField label="Select Your Nationality" required>
            <NationalitySelect
              value={formData.nationality}
              onChange={(val) => onChange({ nationality: val })}
            />
          </FormField>

          {isGroupTrip ? (
            <div className={planPage.formGroupFull}>
              <div className={stepStyles.groupSection}>
                <FormField
                  id="pti-group-departure-month"
                  label="Select Month"
                  required
                >
                  <button
                    id="pti-group-departure-month"
                    type="button"
                    className={stepStyles.monthSelectTrigger}
                  >
                    {formData.departureMonth || "April 2026"}
                  </button>
                </FormField>

                <FormField label="Choose Departure Date" required>
                  <div className={stepStyles.departureGrid}>
                    {GROUP_DEPARTURE_DATES.map((dep) => {
                      const isSelected = formData.departureDateId === dep.id;
                      return (
                        <div
                          key={dep.id}
                          className={`${stepStyles.departureCard} ${isSelected ? stepStyles.departureSelected : ''}`}
                          onClick={() => onChange({ departureDateId: dep.id })}
                        >
                          <div className={stepStyles.departureInfo}>
                            <span className={stepStyles.departureDate}>{dep.date}</span>
                            <span className={stepStyles.departureDuration}>{dep.duration}</span>
                          </div>
                          <CheckboxIndicator variant="square" size="md" selected={isSelected} aria-hidden />
                        </div>
                      );
                    })}
                  </div>
                </FormField>
              </div>
            </div>
          ) : (
            <>
              <FormField label="Start Date" required>
                <CustomDatePicker
                  variant="input"
                  className={`${formStyles.input} ${planPage.dateInput}`}
                  value={formData.startDate}
                  onChange={(date) => onChange({ startDate: date })}
                />
              </FormField>

              <FormField label="End Date" required>
                <CustomDatePicker
                  variant="input"
                  className={`${formStyles.input} ${planPage.dateInput}`}
                  value={formData.endDate}
                  onChange={(date) => onChange({ endDate: date })}
                />
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
                />
              </div>
            );
          })}
        </div>

        <hr className={stepStyles.divider} aria-hidden="true" />

        <h3 className={stepStyles.sectionTitle}>
          Type of Room <span className={formStyles.required}>*</span>
        </h3>

        <div className={stepStyles.roomList}>
          {[
            { id: "single", label: "Single Room", price: "EGP 5,800", count: formData.rooms.single },
            { id: "double", label: "Double Room", price: "EGP 4,100", count: formData.rooms.double },
            { id: "triple", label: "Triple Room", price: "EGP 3,500", count: formData.rooms.triple }
          ].map((room) => (
            <div key={room.id} className={stepStyles.roomRowWrapper}>
              <label className={`${stepStyles.roomInfoBox} ${room.count > 0 ? stepStyles.selected : ''}`}>
                <div className={stepStyles.roomTexts}>
                  <span className={stepStyles.roomTitle}>{room.label}</span>
                  <span className={stepStyles.roomSubtitle}>1 person</span>
                </div>

                <div className={stepStyles.priceContainer}>
                  <span className={stepStyles.priceValue}>{room.price}</span>
                  <span className={stepStyles.roomSubtitle}>/ person</span>
                </div>
              </label>

              <CounterPill
                value={room.count}
                onIncrease={() => handleRoomChange(room.id as any, true)}
                onDecrease={() => handleRoomChange(room.id as any, false)}
                className={stepStyles.roomCounterPill}
                pillOnly
              />
            </div>
          ))}
        </div>

        {formData.rooms.double > 0 && (
          <>
            <h3 className={stepStyles.sectionTitle}>Customize Your Double Rooms ( {formData.rooms.double} selected )</h3>
            <div className={planPage.formGrid}>
              {Array.from({ length: formData.rooms.double }).map((_, i) => (
                <FormField
                  key={i}
                  id={`double-room-${i}`}
                  label={`Room ${i + 1}`}
                  required
                >
                  <SelectDropdown
                    id={`double-room-${i}`}
                    options={ROOM_VIEW_OPTIONS}
                    value="garden"
                    onChange={() => { }}
                  />
                </FormField>
              ))}
            </div>
          </>
        )}

        {formData.rooms.triple > 0 && (
          <>
            <h3 className={stepStyles.sectionTitle}>Customize Your Triple Rooms ( {formData.rooms.triple} selected )</h3>
            <div className={planPage.formGrid}>
              {Array.from({ length: formData.rooms.triple }).map((_, i) => (
                <FormField
                  key={i}
                  id={`triple-room-${i}`}
                  label={`Room ${i + 1}`}
                  required
                >
                  <SelectDropdown
                    id={`triple-room-${i}`}
                    options={ROOM_VIEW_OPTIONS}
                    value="garden"
                    onChange={() => { }}
                  />
                </FormField>
              ))}
            </div>
          </>
        )}

        {(formData.rooms.double > 0 || formData.rooms.triple > 0) && (
          <hr className={`${planPage.stepFormCardDivider} ${stepStyles.divider}`} aria-hidden="true" />
        )}

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

      <BookingStepFooter
        onContinue={onContinue}
        continueLabel="Continue"
      />
    </div>
  );
}
