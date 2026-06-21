import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary"],
      // Only measure the pure-logic modules that are actually unit-tested.
      // UI components rely on the DOM/Next runtime and are out of scope here.
      include: ["src/app/lib/**/*.ts"],
    },
  },
});
