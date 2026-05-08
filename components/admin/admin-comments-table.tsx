"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

type Row = {
  id: string;
  body: string;
  created_at: string;
  post_title: string | null;
  post_slug: string | null;
};

export function AdminCommentsTable({ initial }: { initial: Row[] }) {
  const [rows, setRows] = React.useState<Row[]>(initial);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  async function remove(id: string) {
    if (!confirm("Delete this comment?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        toast({ variant: "destructive", title: "Unable to delete", description: data.error ?? "Try again." });
        return;
      }
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Deleted" });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30 text-left text-xs text-muted-foreground">
              <tr>
                <th className="p-3">Comment</th>
                <th className="p-3">Post</th>
                <th className="p-3">Created</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0">
                  <td className="p-3">
                    <div className="max-w-prose whitespace-pre-wrap">{r.body}</div>
                  </td>
                  <td className="p-3 text-muted-foreground">{r.post_title ?? r.post_slug ?? "Post"}</td>
                  <td className="p-3 text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deletingId === r.id}
                      onClick={() => remove(r.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-sm text-muted-foreground" colSpan={4}>
                    No comments.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
