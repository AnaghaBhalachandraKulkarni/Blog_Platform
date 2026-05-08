import { requireAdmin } from "@/services/auth/guards";
import { AdminUsersTable } from "@/components/admin/admin-users-table";

export default async function AdminUsersPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">Manage roles for platform access control.</p>
      </div>
      <AdminUsersTable />
    </div>
  );
}

