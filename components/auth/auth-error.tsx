"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuthError({ message, className }: { message?: string | null; className?: string }) {
  if (!message) return null;
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive",
        className
      )}
      role="alert"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4" />
      <div>{message}</div>
    </div>
  );
}

