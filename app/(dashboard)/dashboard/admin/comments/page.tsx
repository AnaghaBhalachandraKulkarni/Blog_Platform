import { requireAdmin } from "@/services/auth/guards";
import { getRecentCommentsForAdmin } from "@/services/comments/admin";
import { AdminCommentsTable } from "@/components/admin/admin-comments-table";

export default async function AdminCommentsPage() {
  await requireAdmin();
  const comments = await getRecentCommentsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Comments</h1>
        <p className="text-sm text-muted-foreground">Moderate recent comments.</p>
      </div>
      <AdminCommentsTable initial={comments} />
    </div>
  );
}

