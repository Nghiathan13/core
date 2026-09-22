import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      "fsd/no-higher-level-imports": "error",
      "fsd/import-locality": "error",
      "fsd/no-cross-imports": "error",
    },
  },
  {
    files: ["./src/app/**", "./src/shared/**"],
    rules: {
      "fsd/public-api": "off",
    },
  },
]);
