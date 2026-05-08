import Link from "next/link";
import { SignUpForm } from "@/components/auth/signup-form";
import { AuthCard } from "@/components/auth/auth-card";

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create account"
      footer={
        <div>
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}

