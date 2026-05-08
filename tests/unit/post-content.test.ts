import { describe, expect, it } from "vitest";
import { derivePostComputedFields } from "@/lib/post-content";

describe("derivePostComputedFields", () => {
  it("produces excerpt and reading time", () => {
    const { excerpt, reading_time } = derivePostComputedFields("# Title\n\nSome words here.");
    expect(excerpt.length).toBeGreaterThan(0);
    expect(reading_time).toBeGreaterThan(0);
  });
});

