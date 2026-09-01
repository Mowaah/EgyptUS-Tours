"use client";

import { Suspense, useState } from "react";

import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { CreatePromotion } from "@/components/dashboard/Promotions/CreatePromotion/CreatePromotion";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import styles from "../../../page.module.scss";

export default function CreatePromotionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  
  return (
    <>
      
      
        <DashboardNavbar 
          primaryAction={{ label: "Activate Offer", type: "submit", form: "create-promotion-form", iconSrc: "/images/dashboard/activate-offer.svg", loading: isSubmitting }}
          onSecondaryAction={() => setShowDiscardModal(true)} 
        />
        <Suspense fallback={<div>Loading...</div>}>
          <CreatePromotion onSubmittingChange={setIsSubmitting} />
        </Suspense>

        {showDiscardModal && (
          <SuccessModal
            title="Discard Offer?"
            message="Are you sure you want to discard this offer? All entered data will be lost."
            variant="error"
            primaryButtonText="Discard"
            buttonText="Cancel"
            onPrimaryClick={() => router.push('/dashboard/marketing/promotions')}
            onClose={() => setShowDiscardModal(false)}
          />
        )}
      
    </>
  );
}
