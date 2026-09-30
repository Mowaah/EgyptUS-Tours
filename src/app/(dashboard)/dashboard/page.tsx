import DashboardHome from "@/components/dashboard/DashboardHome";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardDateFilter from "@/components/dashboard/Navbar/DashboardDateFilter/DashboardDateFilter";
import styles from "./page.module.scss";

export default function DashboardHomePage() {
  return (
    <>
      
      
        <DashboardNavbar customFilterDropdown={<DashboardDateFilter />} />
        <DashboardHome />
      
    </>
  );
}
