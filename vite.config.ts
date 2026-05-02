import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "src/app",
  base: "/norman-world/",
  build: {
    outDir: "../../dist",
    emptyOutDir: true
  }
});
