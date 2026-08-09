import { redirect } from "next/navigation";

export default function OldCategoriesPage() {
  redirect("/dashboard/catalog/trips/categories");
}
