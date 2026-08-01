"use client";

import { useState } from "react";
import { Reviews } from "@/components/dashboard/Reviews";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import styles from "../page.module.scss";
export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  return (
    <>
      
      
        <DashboardNavbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery} 
          onPrimaryAction={() => setIsAddModalOpen(true)} 
        />
        <Reviews 
          searchQuery={searchQuery} 
          isAddModalOpen={isAddModalOpen} 
          onAddModalClose={() => setIsAddModalOpen(false)} 
          onClearSearch={() => setSearchQuery("")}
        />
      
    </>
  );
}
