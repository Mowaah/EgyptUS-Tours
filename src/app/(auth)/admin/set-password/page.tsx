import { Suspense } from "react";
import CreateNewPasswordPage from "@/components/dashboard/auth/CreateNewPasswordPage/CreateNewPasswordPage";

export default function AdminSetPasswordRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateNewPasswordPage />
    </Suspense>
  );
}
