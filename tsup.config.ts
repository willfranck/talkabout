import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./electron/main.ts", "./electron/preload.ts"],
  outDir: "electron-build",
  external: ["electron"],
  format: ["esm"],
  cjsInterop: true,
  target: "node20",
  clean: true,
  splitting: false,
  sourcemap: false,
  skipNodeModulesBundle: true,
  treeshake: true,
  bundle: true,
})
