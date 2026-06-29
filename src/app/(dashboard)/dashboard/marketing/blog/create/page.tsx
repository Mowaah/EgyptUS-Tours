"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { CreatePost } from "@/components/dashboard/Blogs";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import styles from "../../../page.module.scss";

export default function CreatePostPage() {
  const router = useRouter();
  
  return (
    <>
      
      
        <DashboardNavbar onSecondaryAction={() => router.push('/dashboard/marketing/blog?draftSaved=true')} />
        <Suspense fallback={<div>Loading...</div>}>
          <CreatePost />
        </Suspense>
      
    </>
  );
}
