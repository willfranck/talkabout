import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./electron/main.ts", "./electron/preload.ts"],
  outDir: "electron-build",
  external: ["electron"],
  format: ["cjs"],
  cjsInterop: true,
  target: "node18",
  clean: true,
  splitting: false,
  sourcemap: false,
  skipNodeModulesBundle: true,
  treeshake: true,
  bundle: true,
});
