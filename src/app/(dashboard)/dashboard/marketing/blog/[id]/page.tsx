import BlogDetails from "@/components/dashboard/Blogs/BlogDetails/BlogDetails";
import styles from "../../../page.module.scss";

export default async function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  
  // Pass the ID or dummy data to the component
  return (
    <>
      
      
        <BlogDetails postId={unwrappedParams.id} />
      
    </>
  );
}
