import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  test: {
    environment: "happy-dom",
    setupFiles: ["src/test-setup.ts"],
    coverage: {
      provider: "v8",
      include: [
        "src/**/lib/**/*.ts",
        "src/**/model/**/*.ts",
        "src/**/i18n/**/*.ts",
      ],
      exclude: ["src/**/*.test.ts", "src/**/index.ts", "src/vite-env.d.ts"],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
});
