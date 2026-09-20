import { redirect } from "next/navigation";

export default async function ReviewWritePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; review_token?: string }>;
}) {
  const params = await searchParams;
  const token = params?.token || params?.review_token;
  if (token) {
    redirect(`/?token=${encodeURIComponent(token)}`);
  }
  redirect("/");
}
