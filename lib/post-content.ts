import { estimateReadingTimeMinutes } from "@/lib/reading-time";

export function makeExcerpt(markdown: string, maxLen = 180): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/[#>*_\-\n\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen - 1).trimEnd()}…`;
}

export function derivePostComputedFields(markdown: string): { excerpt: string; reading_time: number } {
  return {
    excerpt: makeExcerpt(markdown),
    reading_time: estimateReadingTimeMinutes(markdown)
  };
}

