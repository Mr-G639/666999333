// vite.config.mts

import { defineConfig } from "vite";
import zaloMiniApp from "zmp-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [zaloMiniApp(), react()],
  resolve: {
    alias: {
      // Chỉ giữ lại alias "@" trỏ đến thư mục /src
      "@": path.resolve(__dirname, "./src"),
    },
  },
});