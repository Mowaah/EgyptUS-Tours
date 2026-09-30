"use client";

import { useState } from "react";
import { Customers } from "@/components/dashboard/Customers";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardDateFilter from "@/components/dashboard/Navbar/DashboardDateFilter/DashboardDateFilter";
import styles from "../page.module.scss";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      
      
        <DashboardNavbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery} 
          hidePrimaryAction
          customFilterDropdown={<DashboardDateFilter />}
        />
        <Customers 
          searchQuery={searchQuery} 
          onClearSearch={() => setSearchQuery("")}
        />
      
    </>
  );
}
