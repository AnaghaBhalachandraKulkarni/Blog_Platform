import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/slug";

describe("slugify", () => {
  it("normalizes and hyphenates", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("trims and removes quotes", () => {
    expect(slugify("  'Quoted Title'  ")).toBe("quoted-title");
  });
});

