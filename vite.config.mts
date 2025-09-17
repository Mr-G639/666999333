import { defineConfig } from "vite";
import zaloMiniApp from "zmp-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  // Bỏ `root: "./src"` để server chạy từ thư mục gốc của dự án.
  base: "",
  plugins: [zaloMiniApp(), react()],
  resolve: {
    alias: {
      // Sửa lại alias để hoạt động đúng với chuẩn ES Module
      "@": path.resolve(__dirname, "./src"),
    },
  },
});