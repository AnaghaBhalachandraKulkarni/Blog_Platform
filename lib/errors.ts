export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly cause?: unknown;

  constructor(message: string, opts: { code: string; status: number; cause?: unknown }) {
    super(message);
    this.code = opts.code;
    this.status = opts.status;
    this.cause = opts.cause;
  }
}

export function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;
  if (err instanceof Error) {
    return new AppError(err.message, { code: "INTERNAL_ERROR", status: 500, cause: err });
  }
  return new AppError("Unknown error", { code: "INTERNAL_ERROR", status: 500, cause: err });
}

