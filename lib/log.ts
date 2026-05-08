type LogMeta = Record<string, string | number | boolean | null | undefined>;

function safeMeta(meta?: LogMeta) {
  if (!meta) return undefined;
  const entries = Object.entries(meta).filter(([, v]) => v !== undefined);
  return entries.length ? Object.fromEntries(entries) : undefined;
}

export const log = {
  info(message: string, meta?: LogMeta) {
    // eslint-disable-next-line no-console
    console.info(message, safeMeta(meta));
  },
  warn(message: string, meta?: LogMeta) {
    // eslint-disable-next-line no-console
    console.warn(message, safeMeta(meta));
  },
  error(message: string, meta?: LogMeta) {
    // eslint-disable-next-line no-console
    console.error(message, safeMeta(meta));
  }
};

