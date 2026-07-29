import { MarketingContentDetails } from "@/components/dashboard/Marketing";
import styles from "../../../page.module.scss";

export default async function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  
  return (
    <>
        <MarketingContentDetails 
          contentType="blog" 
          postId={unwrappedParams.id} 
        />
    </>
  );
}
