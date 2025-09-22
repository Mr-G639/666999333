// src/components/layout.tsx

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { Suspense, useEffect } from "react";
import { PageSkeleton } from "./skeleton";
import { Toaster } from "react-hot-toast";
import { ScrollRestoration } from "./scroll-restoration";
import FloatingCartPreview from "./floating-cart-preview";
import { useDrag } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import { useSetAtom } from "jotai";
import { mainScrollState } from "@/state";

// Hằng số cấu hình cho cử chỉ vuốt
const SWIPE_THRESHOLD_PERCENT = 0.3; // Tỷ lệ vuốt tối thiểu để kích hoạt hành động
const EDGE_THRESHOLD_PX = 40; // Vùng cạnh màn hình để bắt đầu cử chỉ
const DRAG_ACTIVATION_THRESHOLD_PX = 10; // Ngưỡng kéo tối thiểu để cử chỉ được nhận diện

/**
 * Layout chính của ứng dụng, đóng vai trò là "bộ khung" cho tất cả các trang.
 * - Cung cấp Header, Footer, và khu vực nội dung chính.
 * - Tích hợp cử chỉ vuốt từ cạnh trái để quay lại trang trước.
 * - Quản lý các thành phần global như Toaster (thông báo) và Giỏ hàng nổi.
 * - Theo dõi và cập nhật vị trí cuộn của trang vào state toàn cục.
 */
export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const canGoBack = location.key !== "default"; // Kiểm tra xem có trang trước đó trong lịch sử không

  const setScrollY = useSetAtom(mainScrollState);

  // Thiết lập animation cho việc kéo thả trang
  const [{ x }, api] = useSpring(() => ({
    x: 0,
    config: { tension: 250, friction: 30 },
  }));

  // Reset vị trí animation mỗi khi chuyển trang
  useEffect(() => {
    api.start({ x: 0, immediate: true });
  }, [location.key, api]);

  // Gắn logic xử lý cử chỉ vuốt
  const bind = useDrag(
    ({ down, movement: [mx], initial: [ix], velocity: [vx], last }) => {
      // Bỏ qua nếu không thể quay lại, hoặc nếu bắt đầu vuốt quá xa cạnh màn hình
      if (!canGoBack || (down && ix > EDGE_THRESHOLD_PX)) return;

      if (last) {
        // Nếu người dùng đã thả tay
        if (mx > window.innerWidth * SWIPE_THRESHOLD_PERCENT || vx > 0.5) {
          // Nếu vuốt đủ xa hoặc đủ nhanh, thực hiện hành động quay lại
          navigate(-1);
        } else {
          // Nếu không, trả về vị trí cũ
          api.start({ x: 0 });
        }
      } else {
        // Khi đang vuốt, cập nhật vị trí trang theo tay người dùng
        api.start({ x: Math.max(mx, 0), immediate: true });
      }
    },
    {
      axis: "x",
      threshold: DRAG_ACTIVATION_THRESHOLD_PX,
    },
  );

  return (
    <div className="w-screen h-screen flex flex-col bg-section text-foreground overflow-x-hidden">
      {/* Container cho phép animation và nhận diện cử chỉ */}
      <animated.div
        {...bind()}
        style={{ x, touchAction: 'pan-y' }} // touchAction để trình duyệt không chặn cuộn dọc
        className="flex-1 flex flex-col bg-background h-full w-full"
      >
        <Header />
        <div 
          className="flex-1 overflow-y-auto"
          onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
        >
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </div>
        <Footer />
      </animated.div>
      
      {/* Các thành phần toàn cục, hiển thị bên trên layout chính */}
      <Toaster
        position="top-center"
        containerStyle={{
          top: "var(--zaui-safe-area-top, 0px)",
          marginTop: '12px',
        }}
        toastOptions={{
          className: 'text-sm font-medium',
          duration: 3000,
          style: {
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            padding: '12px 18px',
          },
        }}
      />

      <FloatingCartPreview />
      <ScrollRestoration />
    </div>
  );
}