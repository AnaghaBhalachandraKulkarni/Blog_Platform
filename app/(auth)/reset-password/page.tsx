import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthCard } from "@/components/auth/auth-card";

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Reset password"
      footer={
        <div>
          <Link href="/login" className="underline underline-offset-4">
            Back to sign in
          </Link>
        </div>
      }
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}

