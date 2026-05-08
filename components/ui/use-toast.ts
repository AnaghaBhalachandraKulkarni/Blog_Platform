"use client";

import * as React from "react";
import type { ToastProps } from "@radix-ui/react-toast";

type ToastVariant = "default" | "destructive";

export type ToastInput = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  action?: React.ReactNode;
};

export type ToastState = ToastInput &
  ToastProps & {
    id: string;
  };

type Listener = (state: ToastState[]) => void;

let memoryState: ToastState[] = [];
const listeners = new Set<Listener>();

function notify() {
  for (const listener of listeners) {
    listener(memoryState);
  }
}

function randomId() {
  return crypto.randomUUID();
}

function update(next: ToastState[]) {
  memoryState = next;
  notify();
}

export function dismissToast(id?: string) {
  if (!id) {
    update(memoryState.map((t) => ({ ...t, open: false })));
    return;
  }
  update(memoryState.map((t) => (t.id === id ? { ...t, open: false } : t)));
}

export function toast(input: ToastInput) {
  const id = randomId();

  const next: ToastState = {
    id,
    open: true,
    duration: 5000,
    onOpenChange: (open) => {
      if (!open) dismissToast(id);
    },
    ...input
  };

  update([next, ...memoryState].slice(0, 5));

  return {
    id,
    dismiss: () => dismissToast(id)
  };
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastState[]>(memoryState);

  React.useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  return {
    toasts,
    toast,
    dismiss: dismissToast
  };
}

