import { defineConfig } from "vitest/config";

// Resolve the `@/*` alias from tsconfig.json so tests can import app modules the same way the app does.
export default defineConfig({
  resolve: { tsconfigPaths: true },
});
