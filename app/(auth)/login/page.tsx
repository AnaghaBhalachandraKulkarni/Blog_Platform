import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { AuthCard } from "@/components/auth/auth-card";

export default function LoginPage() {
  return (
    <AuthCard
      title="Sign in"
      footer={
        <div className="flex justify-between">
          <Link href="/signup" className="underline underline-offset-4">
            Create account
          </Link>
          <Link href="/reset-password" className="underline underline-offset-4">
            Forgot password?
          </Link>
        </div>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}

