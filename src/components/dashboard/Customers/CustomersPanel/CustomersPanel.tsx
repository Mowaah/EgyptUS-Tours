"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import { customersColumns, customerRowActions } from "./customersColumns";
import EditCustomerModal from "./EditCustomerModal/EditCustomerModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import { useAdminCustomers } from "@/hooks/useCustomers";
import { updateCustomer, blockCustomer } from "@/services/admin/adminCustomersService";
import type { AdminCustomerFilters, AdminCustomer } from "@/types/adminCustomerTypes";

const filterOptions = {
  nationality: ["All", "Egyptian", "American", "Spanish", "Japanese"],
  bookings: ["High to low", "Low to high"],
  status: ["All", "Active", "Inactive", "Blocked"],
};

interface CustomersPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export default function CustomersPanel({ searchQuery = "", onClearSearch }: CustomersPanelProps) {
  const defaultFilters = {
    nationality: "All",
    bookings: "High to low",
    status: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [selectedRow, setSelectedRow] = useState<AdminCustomer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditBannerOpen, setIsEditBannerOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isBlockBannerOpen, setIsBlockBannerOpen] = useState(false);
  const [isUnblockBannerOpen, setIsUnblockBannerOpen] = useState(false);

  // Build the API filters based on the active UI state
  const apiFilters = useMemo<AdminCustomerFilters>(() => {
    const f: AdminCustomerFilters = { page, page_size: pageSize };
    if (searchQuery) f.search = searchQuery;
    if (appliedFilters.nationality !== "All") f.nationality = appliedFilters.nationality;
    if (appliedFilters.status !== "All") f.status = appliedFilters.status.toLowerCase();
    
    // Convert UI "High to low", "Low to high" into API ordering
    if (appliedFilters.bookings === "High to low") f.ordering = "-bookings";
    else if (appliedFilters.bookings === "Low to high") f.ordering = "bookings";
    else f.ordering = "-created_at";

    return f;
  }, [appliedFilters, searchQuery, page, pageSize]);

  const { customers, isLoading, refetch } = useAdminCustomers(apiFilters);
  
  // Use results from API, fallback to empty array
  const filteredCustomers = customers?.results || [];

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPage(1);
    if (onClearSearch) {
      onClearSearch();
    }
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const filterFields = (
    [
      ["nationality", "Nationality", filterOptions.nationality],
      ["bookings", "Bookings", filterOptions.bookings],
      ["status", "Status", filterOptions.status],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options,
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  const router = useRouter();

  const handleAction = (action: { label: string }, row: AdminCustomer) => {
    if (action.label === "View") {
      router.push(`/dashboard/customers/${row.id}`);
    } else if (action.label === "Edit") {
      setSelectedRow(row);
      setIsEditModalOpen(true);
    } else if (action.label === "Block User" || action.label === "Unblock User") {
      setSelectedRow(row);
      setIsBlockModalOpen(true);
    }
  };

  if (!isLoading && customers && customers.count === 0 && (searchQuery || appliedFilters !== defaultFilters)) {
    return <DashboardSearchEmptyState onClearSearch={resetFilters} />;
  }

  return (
    <TablePanel
      ariaLabel="Customers table"
      title="Customers"
      iconSrc="/images/dashboard/sidebar/user-management.svg"
      headerActions={
        <>
          <TablePanelHeaderButton iconSrc="/images/dashboard/filter.svg">
            Filters
          </TablePanelHeaderButton>
          <TablePanelHeaderButton iconSrc="/images/dashboard/export.svg">
            Export Data
          </TablePanelHeaderButton>
        </>
      }
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
    >
      <DataTable
        data={filteredCustomers}
        columns={customersColumns}
        getRowId={(row) => row.id.toString()}
        rowActions={customerRowActions(handleAction)}
        serverSidePagination={true}
        totalCount={customers?.count || 0}
        pageIndex={page - 1}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p + 1)}
        onPageSizeChange={setPageSize}
        defaultPageSize={10}
      />
      
      {selectedRow && (
        <EditCustomerModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={{
            fullName: selectedRow.full_name,
            phone: selectedRow.phone || "",
            email: selectedRow.email,
            nationality: selectedRow.nationality || "",
            status: selectedRow.status ? selectedRow.status.charAt(0).toUpperCase() + selectedRow.status.slice(1).toLowerCase() : "",
          } as any}
          onSubmit={async (data) => {
            try {
              // Extract fields that might have changed
              const payload = {
                full_name: data.fullName,
                phone: data.phone,
                nationality: data.nationality,
                status: data.status.toLowerCase(),
              };
              await updateCustomer(selectedRow.id.toString(), payload as any);
              setIsEditModalOpen(false);
              setIsEditBannerOpen(true);
              refetch(); // Refresh list
            } catch (err) {
              console.error("Failed to update customer:", err);
              // Handle error visually if necessary
            }
          }}
        />
      )}
      
      <DashboardStatusBanner
        show={isEditBannerOpen}
        onClose={() => setIsEditBannerOpen(false)}
        message="User profile updated successfully"
        variant="success"
      />
      
      {selectedRow && (
        <DashboardConfirmationModal
          open={isBlockModalOpen}
          variant={selectedRow.status === "blocked" ? "activate" : "delete"}
          title={`${selectedRow.status === "blocked" ? "Unblock" : "Block"} ${selectedRow.full_name}`}
          message={
            selectedRow.status === "blocked"
              ? "Are you sure you want to unblock this user? They will regain access to the platform immediately."
              : "Are you sure you want to block this user? They will lose access to the platform immediately."
          }
          cancelLabel="Cancel"
          confirmLabel={selectedRow.status === "blocked" ? "Unblock User" : "Block User"}
          onClose={() => setIsBlockModalOpen(false)}
          onConfirm={async () => {
            try {
              const isBlocking = selectedRow.status !== "blocked";
              await blockCustomer(selectedRow.id.toString(), isBlocking);
              setIsBlockModalOpen(false);
              if (isBlocking) setIsBlockBannerOpen(true);
              else setIsUnblockBannerOpen(true);
              refetch(); // Refresh list
            } catch (err) {
              console.error("Failed to block/unblock customer:", err);
            }
          }}
        />
      )}
      
      <DashboardStatusBanner
        show={isBlockBannerOpen}
        onClose={() => setIsBlockBannerOpen(false)}
        message="User profile blocked successfully"
        variant="success"
      />

      <DashboardStatusBanner
        show={isUnblockBannerOpen}
        onClose={() => setIsUnblockBannerOpen(false)}
        message="User profile unblocked successfully"
        variant="success"
      />
    </TablePanel>
  );
}
