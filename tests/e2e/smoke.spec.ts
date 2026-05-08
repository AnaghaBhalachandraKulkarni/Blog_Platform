import { test, expect } from "@playwright/test";

test("marketing home loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /production-grade blog platform/i })).toBeVisible();
});

test("login page loads", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
});

