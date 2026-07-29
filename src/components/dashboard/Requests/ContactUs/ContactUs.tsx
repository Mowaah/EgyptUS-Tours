"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ContactUsPanel from "./ContactUsPanel";
import styles from "./ContactUs.module.scss";

export default function ContactUs() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={styles.page}>
      <DashboardNavbar
        title="Contact Us"
        subtitle="Review incoming customer messages and respond via email when needed"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {/* Notice there are no summary cards here based on the design! */}
      <ContactUsPanel searchQuery={searchQuery} />
    </div>
  );
}
