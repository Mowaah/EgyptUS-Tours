"use client";

import { use, Suspense } from "react";
import { useRouter } from "next/navigation";
import { CreatePost } from "@/components/dashboard/Blogs";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import styles from "../../../../page.module.scss";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  
  return (
    <>
      
      
        <DashboardNavbar 
          title="Edit Post"
          subtitle="Edit and publish blog content"
          breadcrumbTrail={[
            { label: "Marketing" }, 
            { label: "Blog", href: "/dashboard/marketing/blog" }, 
            { label: "Edit Post" }
          ]}
          primaryAction={{ label: "Save edits", form: "create-post-form", type: "submit", hideIcon: true }}
          secondaryAction={{ label: "Discard" }}
          hideSearch
          hideFilterButton
          onSecondaryAction={() => router.push(`/dashboard/marketing/blog/${unwrappedParams.id}`)} 
        />
        <Suspense fallback={null}>
          <CreatePost postId={unwrappedParams.id} />
        </Suspense>
      
    </>
  );
}
