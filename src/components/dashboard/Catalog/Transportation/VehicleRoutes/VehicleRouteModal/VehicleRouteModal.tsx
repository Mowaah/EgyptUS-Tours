"use client";

import { useEffect, useState } from "react";
import ModalHeader from "@/components/dashboard/shared/ModalHeader/ModalHeader";
import ModalFooter from "@/components/dashboard/shared/ModalFooter/ModalFooter";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import type { VehicleRouteItem, RouteMutationPayload } from "@/services/admin/adminCatalogVehicleRoutesService";
import styles from "./VehicleRouteModal.module.scss";

interface VehicleCategorySimple {
  id: number;
  name: string;
}

interface VehicleRouteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: RouteMutationPayload) => Promise<void> | void;
  initialData?: VehicleRouteItem | null;
  categories: VehicleCategorySimple[];
  isEdit?: boolean;
  isLoading?: boolean;
}

interface LocationTranslation {
  from_location: string;
  to_location: string;
}

const LANG_MAP: Record<Language, "en" | "it" | "es"> = {
  English: "en",
  Italian: "it",
  Spanish: "es",
};

export default function VehicleRouteModal({
  open,
  onClose,
  onSave,
  initialData = null,
  categories = [],
  isEdit = false,
  isLoading = false,
}: VehicleRouteModalProps) {
  const [lang, setLang] = useState<Language>("English");
  const [translations, setTranslations] = useState<Record<"en" | "it" | "es", LocationTranslation>>({
    en: { from_location: "", to_location: "" },
    it: { from_location: "", to_location: "" },
    es: { from_location: "", to_location: "" },
  });

  // Price keyed by category_id -> string (e.g. "35.00" or "")
  const [prices, setPrices] = useState<Record<number, string>>({});
  const [initialPrices, setInitialPrices] = useState<Record<number, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setLang("English");
      setHasSubmitted(false);

      const initialTrans: Record<"en" | "it" | "es", LocationTranslation> = {
        en: {
          from_location: initialData?.translations?.en?.from_location || initialData?.from_location || "",
          to_location: initialData?.translations?.en?.to_location || initialData?.to_location || "",
        },
        it: {
          from_location: initialData?.translations?.it?.from_location || "",
          to_location: initialData?.translations?.it?.to_location || "",
        },
        es: {
          from_location: initialData?.translations?.es?.from_location || "",
          to_location: initialData?.translations?.es?.to_location || "",
        },
      };
      setTranslations(initialTrans);

      const priceMap: Record<number, string> = {};
      if (initialData?.prices && Array.isArray(initialData.prices)) {
        initialData.prices.forEach((p) => {
          if (p.price != null) {
            priceMap[p.category_id] = String(p.price);
          }
        });
      }
      setPrices(priceMap);
      setInitialPrices(priceMap);
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const currentLangKey = LANG_MAP[lang];

  const handleLocationChange = (field: "from_location" | "to_location", val: string) => {
    setTranslations((prev) => ({
      ...prev,
      [currentLangKey]: {
        ...prev[currentLangKey],
        [field]: val,
      },
    }));
  };

  const handlePriceChange = (categoryId: number, val: string) => {
    setPrices((prev) => ({
      ...prev,
      [categoryId]: val,
    }));
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
    if (!isEdit) {
      // All three languages need From and To filled in when creating
      const missingLang = (["English", "Italian", "Spanish"] as Language[]).find((l) => {
        const k = LANG_MAP[l];
        return !translations[k].from_location.trim() || !translations[k].to_location.trim();
      });

      if (missingLang) {
        setLang(missingLang);
        return;
      }

      const priceItems = categories
        .filter((cat) => prices[cat.id] != null && prices[cat.id].trim() !== "")
        .map((cat) => ({
          category_id: cat.id,
          price: parseFloat(prices[cat.id]).toFixed(2),
        }));

      await onSave({
        translations: {
          en: {
            from_location: translations.en.from_location.trim(),
            to_location: translations.en.to_location.trim(),
          },
          it: {
            from_location: translations.it.from_location.trim(),
            to_location: translations.it.to_location.trim(),
          },
          es: {
            from_location: translations.es.from_location.trim(),
            to_location: translations.es.to_location.trim(),
          },
        },
        prices: priceItems,
      });
    } else {
      if (!translations[currentLangKey].from_location.trim() || !translations[currentLangKey].to_location.trim()) {
        return;
      }

      // Edit mode: Send only what changed
      const patchPayload: RouteMutationPayload = {};
      const changedTranslations: Record<string, { from_location?: string; to_location?: string }> = {};

      (["en", "it", "es"] as const).forEach((k) => {
        const initialFrom = initialData?.translations?.[k]?.from_location || (k === "en" ? initialData?.from_location : "") || "";
        const initialTo = initialData?.translations?.[k]?.to_location || (k === "en" ? initialData?.to_location : "") || "";
        const currFrom = translations[k].from_location.trim();
        const currTo = translations[k].to_location.trim();

        if (currFrom !== initialFrom || currTo !== initialTo) {
          changedTranslations[k] = {
            ...(currFrom !== initialFrom ? { from_location: currFrom } : {}),
            ...(currTo !== initialTo ? { to_location: currTo } : {}),
          };
        }
      });

      if (Object.keys(changedTranslations).length > 0) {
        patchPayload.translations = changedTranslations as RouteMutationPayload["translations"];
      }

      const changedPrices: { category_id: number; price: string | null }[] = [];
      categories.forEach((cat) => {
        const oldPrice = initialPrices[cat.id];
        const newPrice = prices[cat.id]?.trim();

        if (oldPrice && !newPrice) {
          // Price was removed
          changedPrices.push({ category_id: cat.id, price: null });
        } else if (newPrice && newPrice !== oldPrice) {
          changedPrices.push({ category_id: cat.id, price: parseFloat(newPrice).toFixed(2) });
        }
      });

      if (changedPrices.length > 0) {
        patchPayload.prices = changedPrices;
      }

      await onSave(patchPayload);
    }
  };

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-route-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <ModalHeader
          iconSrc="/images/dashboard/catalog/routes.svg"
          title={isEdit ? "Edit Route" : "Add New Route"}
          onClose={onClose}
        />

        <div className={styles.scrollArea}>
          <div className={styles.tabsWrap}>
            <LanguageTabs active={lang} onChange={setLang} />
          </div>

          <div className={styles.fieldsStack}>
            <DashboardField
              variant="modal"
              label="From"
              id={`route-from-${currentLangKey}`}
              placeholder="Enter departure location"
              value={translations[currentLangKey].from_location}
              onChange={(e) => handleLocationChange("from_location", e.target.value)}
              error={
                hasSubmitted && !translations[currentLangKey].from_location.trim()
                  ? "Departure location is required"
                  : undefined
              }
              required
            />

            <DashboardField
              variant="modal"
              label="To"
              id={`route-to-${currentLangKey}`}
              placeholder="Enter destination location"
              value={translations[currentLangKey].to_location}
              onChange={(e) => handleLocationChange("to_location", e.target.value)}
              error={
                hasSubmitted && !translations[currentLangKey].to_location.trim()
                  ? "Destination location is required"
                  : undefined
              }
              required
            />
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map((cat) => (
              <DashboardField
                key={cat.id}
                variant="modal"
                label={cat.name}
                type="number"
                step="0.01"
                min="0"
                placeholder="2,575"
                endAdornment="$"
                value={prices[cat.id] ?? ""}
                onChange={(e) => handlePriceChange(cat.id, e.target.value)}
              />
            ))}
          </div>
        </div>

        <ModalFooter
          secondaryLabel="Cancel"
          secondaryOnClick={onClose}
          primaryLabel={isEdit ? "Save Changes" : "Add"}
          primaryOnClick={handleSubmit}
          primaryIsLoading={isLoading}
        />
      </section>
    </div>
  );
}
