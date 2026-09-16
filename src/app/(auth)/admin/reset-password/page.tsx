import { Suspense } from "react";
import CreateNewPasswordPage from "@/components/dashboard/auth/CreateNewPasswordPage/CreateNewPasswordPage";

export default function AdminResetPasswordRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateNewPasswordPage />
    </Suspense>
  );
}
