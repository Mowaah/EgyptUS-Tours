import React, { useState } from "react";
import ActionNoteModal from "@/components/dashboard/LeadsInquiries/ActionNoteModal/ActionNoteModal";

interface MarkAsClosedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function MarkAsClosedModal({ isOpen, onClose, onSubmit }: MarkAsClosedModalProps) {
  const handleConfirm = () => {
    onSubmit();
  };

  return (
    <ActionNoteModal
      open={isOpen}
      onClose={onClose}
      onSubmit={handleConfirm}
      config={{
        title: "Mark As Closed",
        iconSrc: "/images/dashboard/requests/mark-closed.svg", // Using the icon we just created
        label: "Note",
        primaryLabel: "Mark as Closed",
        placeholder: "Summarize the outcome of this conversation...",
      }}
    />
  );
}
