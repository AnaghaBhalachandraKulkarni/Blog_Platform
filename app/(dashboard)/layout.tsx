import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/services/auth/session";
import { getMyProfile } from "@/services/profiles/queries";
import { DashboardUserMenu } from "@/components/dashboard/user-menu";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerSession();
  if (!user) redirect("/login");
  const profile = await getMyProfile();

  return (
    <div className="min-h-dvh">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="font-semibold">
              Dashboard
            </Link>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/posts">Posts</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/profile">Profile</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/blog">View site</Link>
            </Button>
            {profile?.role === "admin" ? (
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/admin">Admin</Link>
              </Button>
            ) : null}
          </div>
          <DashboardUserMenu
            email={user.email ?? "user"}
            displayName={profile?.display_name ?? null}
            role={profile?.role ?? "reader"}
          />
        </div>
      </header>
      <main className="container py-10">{children}</main>
    </div>
  );
}
