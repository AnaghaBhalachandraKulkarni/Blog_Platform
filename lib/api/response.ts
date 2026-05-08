import { NextResponse } from "next/server";

export type ApiErrorBody = { error: string; code: string };

export function jsonOk<T>(body: T, init?: ResponseInit) {
  return NextResponse.json(body, init);
}

export function jsonError(
  body: ApiErrorBody,
  init?: ResponseInit & { status?: number }
) {
  return NextResponse.json(body, { ...init, status: init?.status ?? 400 });
}

