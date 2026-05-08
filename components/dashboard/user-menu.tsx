"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function DashboardUserMenu({
  email,
  displayName,
  role
}: {
  email: string;
  displayName: string | null;
  role: "admin" | "writer" | "reader";
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function signOut() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast({ title: "Signed out" });
      router.replace("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden text-right text-xs sm:block">
        <div className="font-medium leading-none">{displayName ?? email}</div>
        <div className="text-muted-foreground">{role}</div>
      </div>
      <Button variant="outline" size="sm" onClick={signOut} disabled={loading}>
        <User className="mr-2 h-4 w-4" />
        Account
        <LogOut className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

