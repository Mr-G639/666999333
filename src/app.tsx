// src/app.tsx

// React core
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

// Router
import router from "@/router";

// ZaUI stylesheet
// SỬA LỖI: Đây là đường dẫn chính xác đã được xác nhận
import 'zmp-ui/zaui.css'; 

// Tailwind stylesheet
import "@/css/tailwind.scss";
// Your custom stylesheet
import "@/css/app.scss";

// Expose app configuration to the window object
import appConfig from "../app-config.json";

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

// Mount the React application
const root = createRoot(document.getElementById("app")!);
root.render(createElement(RouterProvider, { router }));