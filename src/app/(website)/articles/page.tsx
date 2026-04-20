import ArticlesPage from "@/components/website/ArticlesPage/ArticlesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles | EgyptUS Tours",
  description: "Explore our insider guides and professional tips.",
};

export default function Page() {
  return <ArticlesPage />;
}
