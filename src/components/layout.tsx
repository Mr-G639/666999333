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

      {/* --- THAY ĐỔI BẮT ĐẦU TỪ ĐÂY --- */}
      <Toaster
        position="bottom-center" // 1. Đặt vị trí ở giữa và phía dưới màn hình
        containerStyle={{
          // 2. Đẩy thông báo lên trên thanh Footer
          // Giá trị này được tính toán để nằm ngay trên thanh điều hướng dưới cùng
          bottom: "calc(var(--safe-bottom) + 60px)", 
        }}
        toastOptions={{
          // 3. Tùy chỉnh giao diện chung cho tất cả thông báo
          className: 'text-sm font-medium',
          style: {
            borderRadius: '9999px', // Bo tròn như viên thuốc
            background: '#333',     // Nền đen
            color: '#fff',          // Chữ trắng
            padding: '10px 16px',
          },
          // Animation trượt lên/xuống là mặc định cho vị trí "bottom-center"
        }}
      />
      {/* --- KẾT THÚC THAY ĐỔI --- */}

      <FloatingCartPreview />
      <ScrollRestoration />
    </div>
  );
}