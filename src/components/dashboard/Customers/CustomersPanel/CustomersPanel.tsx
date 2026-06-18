"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import { mockCustomers } from "../customersData";
import { customersColumns, customerRowActions } from "./customersColumns";
import EditCustomerModal from "./EditCustomerModal";
import DashboardStatusBanner from "@/components/shared/DashboardStatusBanner/DashboardStatusBanner";
import DashboardConfirmationModal from "@/components/shared/DashboardConfirmationModal/DashboardConfirmationModal";

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
  
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditBannerOpen, setIsEditBannerOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isBlockBannerOpen, setIsBlockBannerOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    let result = mockCustomers.filter((customer) => {
      if (searchQuery && !customer.name.toLowerCase().includes(searchQuery.toLowerCase()) && !customer.id.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (appliedFilters.nationality !== "All" && customer.nationality !== appliedFilters.nationality) return false;
      if (appliedFilters.status !== "All" && customer.status !== appliedFilters.status) return false;
      return true;
    });

    if (appliedFilters.bookings === "High to low") {
      result = result.sort((a, b) => b.bookings - a.bookings);
    } else if (appliedFilters.bookings === "Low to high") {
      result = result.sort((a, b) => a.bookings - b.bookings);
    }

    return result;
  }, [appliedFilters, searchQuery]);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    if (onClearSearch) {
      onClearSearch();
    }
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
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

  const handleAction = (action: { label: string }, row: any) => {
    if (action.label === "Edit") {
      setSelectedRow({
        fullName: row.name,
        phone: row.phone,
        email: row.email,
        nationality: row.nationality,
        status: row.status,
      });
      setIsEditModalOpen(true);
    } else if (action.label === "Block User") {
      setSelectedRow(row);
      setIsBlockModalOpen(true);
    }
  };

  if (mockCustomers.length > 0 && filteredCustomers.length === 0) {
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
        getRowId={(row) => row.id}
        selectable
        rowActions={customerRowActions(handleAction)}
        defaultPageSize={16}
      />
      
      <EditCustomerModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={selectedRow}
        onSubmit={(data) => {
          console.log("Saving customer data:", data);
          setIsEditModalOpen(false);
          setIsEditBannerOpen(true);
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
        variant="delete"
        title={`Block ${selectedRow?.name || selectedRow?.fullName}`}
        message="Are you sure you want to block this user? They will lose access to the platform immediately."
        cancelLabel="Cancel"
        confirmLabel="Block User"
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={() => {
          console.log(`Blocked user ${selectedRow?.id}`);
          setIsBlockModalOpen(false);
          setIsBlockBannerOpen(true);
        }}
      />
      
      <DashboardStatusBanner
        show={isBlockBannerOpen}
        onClose={() => setIsBlockBannerOpen(false)}
        message="User profile blocked successfully"
        variant="success"
      />
    </TablePanel>
  );
}
