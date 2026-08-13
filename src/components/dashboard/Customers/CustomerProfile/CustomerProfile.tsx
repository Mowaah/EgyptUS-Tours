"use client";

import { useState } from "react";
import Image from "next/image";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardTabs from "@/components/dashboard/shared/DashboardTabs/DashboardTabs";
import CustomerOverview from "./CustomerOverview/CustomerOverview";
import BookingHistoryPanel from "./BookingHistory/BookingHistoryPanel";
import CustomTripRequestsPanel from "./CustomTripRequests/CustomTripRequestsPanel";
import { ReviewsPanel } from "@/components/dashboard/Reviews/ReviewsPanel/ReviewsPanel";
import ProfileHeader from "@/components/dashboard/shared/ProfileHeader/ProfileHeader";
import pageStyles from "@/app/(dashboard)/dashboard/page.module.scss";
import styles from "./CustomerProfile.module.scss";
import { useAdminCustomer } from "@/hooks/useCustomers";
import { updateCustomer, blockCustomer } from "@/services/admin/adminCustomersService";
import EditCustomerModal from "@/components/dashboard/Customers/CustomersPanel/EditCustomerModal/EditCustomerModal";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import { COUNTRIES } from "@/data/countries";

const getCountryName = (code: string | null) => {
  if (!code) return "No nationality";
  const country = COUNTRIES.find(c => c.code.toLowerCase() === code.trim().toLowerCase());
  return country ? country.nationality : code;
};

import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface CustomerProfileProps {
  customerId: string;
}

type TabType = "overview" | "booking-history" | "custom-trip-requests" | "reviews";

import { Suspense } from "react";

export default function CustomerProfile({ customerId }: CustomerProfileProps) {
  return (
    <>
      <Suspense fallback={<div aria-label="Customer profile loading" />}>
        <CustomerProfileContent customerId={customerId} />
      </Suspense>
    </>
  );
}

function CustomerProfileContent({ customerId }: CustomerProfileProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const activeTab = (searchParams.get("tab") as TabType) || "overview";

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditBannerOpen, setIsEditBannerOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isBlockBannerOpen, setIsBlockBannerOpen] = useState(false);
  const [isUnblockBannerOpen, setIsUnblockBannerOpen] = useState(false);

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const { customer, isLoading, refetch } = useAdminCustomer(customerId);

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading customer profile...</div>;
  }

  if (!customer) {
    return <div style={{ padding: 40, textAlign: "center" }}>Customer not found</div>;
  }

  return (
    <div className={styles.page}>
        <DashboardNavbar
          breadcrumbTrail={[
            { label: "Customers", href: "/dashboard/customers" },
            { label: customer.full_name }
          ]}
        >
          <ProfileHeader
            title={`${customer.full_name} - CUS-${customer.id}`}
            pillLabel={customer.status.charAt(0).toUpperCase() + customer.status.slice(1).toLowerCase()}
            pillVariant={customer.status === "active" ? "green" : customer.status === "blocked" ? "red" : "gray"}
            subtitleElements={[
              customer.email,
              customer.phone || "No phone",
              getCountryName(customer.nationality),
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

                <button className={styles.editButton} type="button" onClick={() => setIsEditModalOpen(true)}>
                  <Image src="/images/dashboard/edit.svg" alt="" width={20} height={20} />
                  Edit Profile
                </button>

                <button className={styles.blockButton} type="button" onClick={() => setIsBlockModalOpen(true)}>
                  <Image src="/images/dashboard/block.svg" alt="" width={20} height={20} />
                  {customer.status === "blocked" ? "Unblock User" : "Block User"}
                </button>
              </>
            }
          />
        </DashboardNavbar>

        <div className={styles.contentWrapper}>
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

        {activeTab === "overview" && <CustomerOverview customerId={customerId} />}
        {activeTab === "booking-history" && <BookingHistoryPanel customerId={customerId} />}
        {activeTab === "custom-trip-requests" && <CustomTripRequestsPanel customerId={customerId} />}
        {activeTab === "reviews" && (
          <ReviewsPanel 
            title="User Reviews" 
            hideCustomerColumn 
            emptyStateTitle="No Reviews Yet"
            emptyStateSubtitle="Customer reviews will appear here once users start sharing their feedback"
            customerId={customerId}
          />
        )}

      <EditCustomerModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={{
          fullName: customer.full_name,
          phone: customer.phone || "",
          email: customer.email,
          nationality: customer.nationality || "",
          status: customer.status ? customer.status.charAt(0).toUpperCase() + customer.status.slice(1).toLowerCase() : "",
        } as any}
        onSubmit={async (data) => {
          try {
            const payload = {
              full_name: data.fullName,
              phone: data.phone,
              nationality: data.nationality,
              status: data.status.toLowerCase(),
            };
            await updateCustomer(customer.id.toString(), payload as any);
            setIsEditModalOpen(false);
            setIsEditBannerOpen(true);
            refetch();
          } catch (err) {
            console.error("Failed to update customer:", err);
          }
        }}
      />
      
      <DashboardStatusBanner
        show={isEditBannerOpen}
        onClose={() => setIsEditBannerOpen(false)}
        message="User profile updated successfully"
        variant="success"
      />

      <DashboardConfirmationModal
        open={isBlockModalOpen}
        variant={customer.status === "blocked" ? "activate" : "delete"}
        title={`${customer.status === "blocked" ? "Unblock" : "Block"} ${customer.full_name}`}
        message={
          customer.status === "blocked"
            ? "Are you sure you want to unblock this user? They will regain access to the platform immediately."
            : "Are you sure you want to block this user? They will lose access to the platform immediately."
        }
        cancelLabel="Cancel"
        confirmLabel={customer.status === "blocked" ? "Unblock User" : "Block User"}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={async () => {
          try {
            const newBlockedStatus = customer.status !== "blocked";
            await blockCustomer(customer.id.toString(), newBlockedStatus);
            setIsBlockModalOpen(false);
            if (newBlockedStatus) setIsBlockBannerOpen(true);
            else setIsUnblockBannerOpen(true);
            refetch();
          } catch (err) {
            console.error("Failed to block/unblock customer:", err);
          }
        }}
      />

      <DashboardStatusBanner
        show={isBlockBannerOpen}
        onClose={() => setIsBlockBannerOpen(false)}
        message="User blocked successfully"
        variant="success"
      />

      <DashboardStatusBanner
        show={isUnblockBannerOpen}
        onClose={() => setIsUnblockBannerOpen(false)}
        message="User unblocked successfully"
        variant="success"
      />
      </div>
    </div>
  );
}
