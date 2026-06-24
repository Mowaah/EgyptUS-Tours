"use client";

import { useState } from "react";
import Image from "next/image";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import DashboardTabs from "@/components/shared/DashboardTabs/DashboardTabs";
import CustomerOverview from "./CustomerOverview";
import BookingHistoryPanel from "./BookingHistory/BookingHistoryPanel";
import CustomTripRequestsPanel from "./CustomTripRequests/CustomTripRequestsPanel";
import { ReviewsPanel } from "@/components/dashboard/Reviews/ReviewsPanel/ReviewsPanel";
import ProfileHeader from "@/components/shared/ProfileHeader/ProfileHeader";
import pageStyles from "@/app/(dashboard)/dashboard/page.module.scss";
import styles from "./CustomerProfile.module.scss";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface CustomerProfileProps {
  customerId: string;
}

type TabType = "overview" | "booking-history" | "custom-trip-requests" | "reviews";

import { Suspense } from "react";

export default function CustomerProfile({ customerId }: CustomerProfileProps) {
  return (
    <main className={pageStyles.page}>
      <DashboardSidebar />
      <Suspense fallback={<section className={pageStyles.content} aria-label="Customer profile content" />}>
        <CustomerProfileContent customerId={customerId} />
      </Suspense>
    </main>
  );
}

function CustomerProfileContent({ customerId }: CustomerProfileProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const activeTab = (searchParams.get("tab") as TabType) || "overview";

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // In a real app, we'd fetch the customer by ID. Using mock data for now.
  const customer = {
    id: "BK-TR01",
    name: "Linda Blair",
    email: "lindablair@mail.com",
    phone: "+20 101 234 5678",
    country: "USA",
    status: "Active",
  };

  return (
    <section className={pageStyles.content} aria-label="Customer profile content">
        <DashboardNavbar
          breadcrumbTrail={[
            { label: "Customers", href: "/dashboard/customers" },
            { label: customer.name }
          ]}
        >
          <ProfileHeader
            title={`${customer.name} - ${customer.id}`}
            pillLabel={customer.status}
            pillVariant="green"
            subtitleElements={[
              customer.email,
              customer.phone,
              customer.country,
            ]}
            actionButtons={
              <>
                <label className={styles.searchBox}>
                  <Image
                    src="/images/dashboard/navbar/search.svg"
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden
                  />
                  <input type="search" placeholder="Search ........" />
                </label>

                <button className={styles.editButton} type="button">
                  <Image src="/images/dashboard/edit.svg" alt="" width={20} height={20} />
                  Edit Profile
                </button>

                <button className={styles.blockButton} type="button">
                  <Image src="/images/dashboard/block.svg" alt="" width={20} height={20} />
                  Block User
                </button>
              </>
            }
          />
        </DashboardNavbar>

          <DashboardTabs 
            tabs={[
              { id: "overview", label: "Overview" },
              { id: "booking-history", label: "Booking History" },
              { id: "custom-trip-requests", label: "Custom Trip Requests" },
              { id: "reviews", label: "Reviews" },
            ]}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            ariaLabel="Customer profile sections"
          />

        {activeTab === "overview" && <CustomerOverview />}
        {activeTab === "booking-history" && <BookingHistoryPanel />}
        {activeTab === "custom-trip-requests" && <CustomTripRequestsPanel />}
        {activeTab === "reviews" && (
          <ReviewsPanel 
            title="User Reviews" 
            hideCustomerColumn 
            emptyStateTitle="No Reviews Yet"
            emptyStateSubtitle="Customer reviews will appear here once users start sharing their feedback"
          />
        )}
      </section>
  );
}
