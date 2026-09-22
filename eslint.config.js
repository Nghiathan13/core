import { FlatCompat } from "@eslint/eslintrc";
import tsParser from "@typescript-eslint/parser";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const publicApi = require("@feature-sliced/eslint-config/rules/public-api");
const [publicApiLevel, publicApiOptions] = publicApi.rules["import/no-internal-modules"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: ["dist/**", "src-tauri/**", "node_modules/**", "**/*.gitkeep"],
  },
  ...compat.extends("@feature-sliced").map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  },
  {
    // FSD v2.1 allows custom shared segments (e.g. i18n) that the beta
    // @feature-sliced config does not know. Extend its allow list instead
    // of replacing it, so upstream updates keep flowing through.
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "import/no-internal-modules": [
        publicApiLevel,
        { allow: [...publicApiOptions.allow, "**/*shared/i18n"] },
      ],
    },
  },
];
