import Link from "next/link";
import { requireAdmin } from "@/services/auth/guards";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/admin/users">Users</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/admin/posts">Posts</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/admin/comments">Comments</Link>
        </Button>
      </div>
      {children}
    </div>
  );
}

