import React, { useState } from "react";
import ActionNoteModal from "@/components/dashboard/LeadsInquiries/ActionNoteModal/ActionNoteModal";

interface MarkAsClosedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

export default function MarkAsClosedModal({ isOpen, onClose, onSubmit }: MarkAsClosedModalProps) {
  const handleConfirm = (note: string) => {
    onSubmit(note);
  };

  return (
    <ActionNoteModal
      open={isOpen}
      onClose={onClose}
      onSubmit={handleConfirm}
      config={{
        title: "Mark As Closed",
        iconSrc: "/images/dashboard/requests/contact-us/mark-as-closed.svg",
        label: "Note",
        primaryLabel: "Mark as Closed",
        placeholder: "Summarize the outcome of this conversation...",
      }}
    />
  );
}
