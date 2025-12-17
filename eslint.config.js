import tseslint from "typescript-eslint";
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["node_modules/**", "main.js", "*.mjs", "eslint.config.js"],
  },
  ...obsidianmd.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Acronyms like LLM should be allowed in uppercase
      "obsidianmd/ui/sentence-case": "off",
      // Allow any for loadData() return type
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
    },
  },
  {
    files: ["package.json"],
    rules: {
      // builtin-modules is used in esbuild config (standard Obsidian setup)
      "depend/ban-dependencies": "off",
    },
  }
);
