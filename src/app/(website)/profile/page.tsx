import { Suspense } from "react";
import ProfilePage from "@/components/website/ProfilePage/ProfilePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Egypt US Tours",
  description: "Manage your travel bookings, favorites, and trip requests in one place.",
};

export default function Profile() {
  return (
    <Suspense fallback={null}>
      <ProfilePage />
    </Suspense>
  );
}
