"use client";

import { use, Suspense } from "react";
import { useRouter } from "next/navigation";
import { CreatePost } from "@/components/dashboard/Articles";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import styles from "../../../../page.module.scss";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  
  return (
    <>
      
      
        <DashboardNavbar 
          title="Edit Post"
          subtitle="Edit and publish article content"
          breadcrumbTrail={[
            { label: "Marketing" }, 
            { label: "Article", href: "/dashboard/marketing/articles" }, 
            { label: "Edit Post" }
          ]}
          primaryAction={{ label: "Save edits", form: "create-post-form", type: "submit", hideIcon: true }}
          secondaryAction={{ label: "Discard" }}
          hideSearch
          hideFilterButton
          onSecondaryAction={() => router.push(`/dashboard/marketing/articles/${unwrappedParams.id}`)} 
        />
        <Suspense fallback={null}>
          <CreatePost postId={unwrappedParams.id} />
        </Suspense>
      
    </>
  );
}
