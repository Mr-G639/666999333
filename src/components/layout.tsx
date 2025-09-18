// src/components/layout.tsx

import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { Suspense } from "react";
import { PageSkeleton } from "./skeleton";
import { Toaster } from "react-hot-toast";
import { ScrollRestoration } from "./scroll-restoration";
import FloatingCartPreview from "./floating-cart-preview";

export default function Layout() {
  return (
    <div className="w-screen h-screen flex flex-col bg-section text-foreground">
      <Header />
      <div className="flex-1 overflow-y-auto bg-background">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
      
      {/* --- THAY ĐỔI Ở ĐÂY --- */}
      <Toaster
        position="top-center"
        // 1. Thêm containerStyle để đẩy toàn bộ khu vực thông báo xuống
        containerStyle={{
          top: 123, // Khoảng cách từ đỉnh màn hình, bạn có thể điều chỉnh cho phù hợp
        }}
        toastOptions={{
          className: 'text-sm font-medium', 
          style: {
            // 2. Xóa 'top: 24' vì đã có containerStyle
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            padding: '12px 18px',
            width: '80%',
            animation: 'slide-down 0.35s cubic-bezier(0.21, 1.02, 0.73, 1)',
          },
        }}
      />
      {/* --- KẾT THÚC THAY ĐỔI --- */}

      <FloatingCartPreview />
      <ScrollRestoration />
    </div>
  );
}