"use client";

import * as React from "react";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

type UserRole = "admin" | "writer" | "reader";

type ProfileRow = {
  id: string;
  display_name: string | null;
  role: UserRole;
  created_at: string;
};

const RoleSchema = z.enum(["admin", "writer", "reader"]);

export function AdminUsersTable() {
  const [profiles, setProfiles] = React.useState<ProfileRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { profiles: ProfileRow[] };
      setProfiles(data.profiles);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, []);

  async function updateRole(userId: string, role: UserRole) {
    const parsed = RoleSchema.safeParse(role);
    if (!parsed.success) return;
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role })
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      toast({ variant: "destructive", title: "Unable to update", description: data.error ?? "Try again." });
      return;
    }
    setProfiles((prev) => prev.map((p) => (p.id === userId ? { ...p, role } : p)));
    toast({ title: "Role updated" });
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-10 text-sm text-muted-foreground">Loading…</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30 text-left text-xs text-muted-foreground">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-b last:border-b-0">
                  <td className="p-3">
                    <div className="font-medium">{p.display_name ?? p.id}</div>
                    <div className="text-xs text-muted-foreground">{p.id}</div>
                  </td>
                  <td className="p-3">
                    <select
                      className="h-9 rounded-md border bg-background px-2"
                      value={p.role}
                      onChange={(e) => updateRole(p.id, e.target.value as UserRole)}
                    >
                      <option value="reader">reader</option>
                      <option value="writer">writer</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="p-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
