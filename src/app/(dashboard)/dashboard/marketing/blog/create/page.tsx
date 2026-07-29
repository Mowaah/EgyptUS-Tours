"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { MarketingCreatePost } from "@/components/dashboard/Marketing";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import styles from "../../../page.module.scss";

export default function CreatePostPage() {
  const router = useRouter();
  
  return (
    <>
        <DashboardNavbar />
        <Suspense fallback={<div>Loading...</div>}>
          <MarketingCreatePost 
            contentType="blog" 
             
             
          />
        </Suspense>
    </>
  );
}

