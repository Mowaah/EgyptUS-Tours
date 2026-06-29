import ArticleDetails from "@/components/dashboard/Articles/ArticleDetails/ArticleDetails";
import styles from "../../../page.module.scss";

export default async function ArticleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  
  // Pass the ID or dummy data to the component
  return (
    <>
      
      
        <ArticleDetails postId={unwrappedParams.id} />
      
    </>
  );
}
