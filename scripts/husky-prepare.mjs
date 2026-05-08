import fs from "node:fs";
import { spawnSync } from "node:child_process";

const isCI = process.env.CI === "true" || process.env.CI === "1";
if (isCI || process.env.HUSKY === "0") {
  process.exit(0);
}

function hasUsableGitDir() {
  try {
    if (!fs.existsSync(".git")) return false;
    const stat = fs.statSync(".git");
    if (!stat.isDirectory()) return false;
    return fs.existsSync(".git/HEAD");
  } catch {
    return false;
  }
}

if (!hasUsableGitDir()) {
  // Not a git checkout (or git metadata is unavailable); skip installing hooks.
  process.exit(0);
}

const result = spawnSync(process.platform === "win32" ? "npx.cmd" : "npx", ["husky"], {
  stdio: "inherit"
});

process.exit(result.status ?? 0);

