"use client";

import { use, Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { MarketingCreatePost } from "@/components/dashboard/Marketing";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import styles from "../../../../page.module.scss";

export default function EditPostPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ from?: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const unwrappedSearchParams = use(searchParams);
  const [isDirty, setIsDirty] = useState(false);
  const [postStatus, setPostStatus] = useState<string>("");
  const fromList = unwrappedSearchParams.from === "list";
  
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
          primaryAction={
            (postStatus === "Scheduled" || postStatus === "Draft")
              ? { label: "Publish Post", iconSrc: "/images/dashboard/arrow-up.svg", iconRotation: 90, form: "create-post-form", type: "submit" }
              : { label: "Save edits", form: "create-post-form", type: "submit", hideIcon: true, disabled: !isDirty }
          }
          secondaryAction={
            (postStatus === "Scheduled" || postStatus === "Draft")
              ? { label: "Save edits", form: "create-post-form", type: "submit", hideIcon: true, disabled: !isDirty, variant: "primary" }
              : { label: "Discard", disabled: !isDirty }
          }
          tertiaryAction={
            (postStatus === "Scheduled" || postStatus === "Draft")
              ? { label: "Discard", disabled: !isDirty, variant: "secondary" }
              : undefined
          }
          hideSearch
          hideFilterButton
          onSecondaryAction={() => router.push(fromList ? `/dashboard/marketing/blog` : `/dashboard/marketing/blog/${unwrappedParams.id}`)} 
        />
        <Suspense fallback={null}>
          <MarketingCreatePost 
            contentType="blog"
            postId={unwrappedParams.id}
            onDirtyChange={setIsDirty}
            onStatusChange={setPostStatus}
          />
        </Suspense>
      
    </>
  );
}
