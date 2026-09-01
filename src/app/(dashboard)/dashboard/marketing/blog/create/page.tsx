"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { MarketingCreatePost } from "@/components/dashboard/Marketing";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import styles from "../../../page.module.scss";

export default function CreatePostPage() {
  const router = useRouter();
  const [isDirty, setIsDirty] = useState(false);
  
  return (
    <>
        <DashboardNavbar 
          primaryAction={{ label: "Publish Post", iconSrc: "/images/dashboard/arrow-up.svg", iconRotation: 90, form: "create-post-form", type: "submit" }}
          secondaryAction={{ label: "Save draft", iconSrc: "/images/dashboard/save2.svg", form: "create-post-form", type: "submit", disabled: !isDirty }}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <MarketingCreatePost 
            contentType="blog" 
            onDirtyChange={setIsDirty}
          />
        </Suspense>
    </>
  );
}

