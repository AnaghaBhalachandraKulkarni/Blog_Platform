import Link from "next/link";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { AuthCard } from "@/components/auth/auth-card";

export default function UpdatePasswordPage() {
  return (
    <AuthCard
      title="Set a new password"
      footer={
        <div>
          <Link href="/" className="underline underline-offset-4">
            Return home
          </Link>
        </div>
      }
    >
      <UpdatePasswordForm />
    </AuthCard>
  );
}

