/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "next/typescript"],
  parserOptions: {
    project: "./tsconfig.json"
  },
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { "prefer": "type-imports", "fixStyle": "inline-type-imports" }
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
    ],
    "no-restricted-syntax": [
      "error",
      {
        "selector": "TSAnyKeyword",
        "message": "Do not use `any`."
      }
    ]
  }
};

