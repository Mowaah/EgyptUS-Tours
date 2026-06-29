"use client";

import { useState } from "react";
import { Customers } from "@/components/dashboard/Customers";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import styles from "../page.module.scss";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      
      
        <DashboardNavbar 
          onSearchChange={setSearchQuery} 
          hidePrimaryAction
        />
        <Customers 
          searchQuery={searchQuery} 
          onClearSearch={() => setSearchQuery("")}
        />
      
    </>
  );
}
