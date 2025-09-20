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

const SWIPE_THRESHOLD_PERCENT = 0.3;
const EDGE_THRESHOLD_PX = 40;
const DRAG_ACTIVATION_THRESHOLD_PX = 10;

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const canGoBack = location.key !== "default";
  
  const setScrollY = useSetAtom(mainScrollState);

  const [{ x }, api] = useSpring(() => ({
    x: 0,
    config: { tension: 250, friction: 30 },
  }));

  useEffect(() => {
    api.start({ x: 0, immediate: true });
  }, [location.key, api]);

  const bind = useDrag(
    ({ down, movement: [mx], initial: [ix], velocity: [vx], last }) => {
      if (!canGoBack || (down && ix > EDGE_THRESHOLD_PX)) return;
      
      if (last) {
        if (mx > window.innerWidth * SWIPE_THRESHOLD_PERCENT || vx > 0.5) {
          navigate(-1);
        } else {
          api.start({ x: 0 });
        }
      } else {
        api.start({ x: Math.max(mx, 0), immediate: true });
      }
    },
    {
      axis: "x",
      threshold: DRAG_ACTIVATION_THRESHOLD_PX,
    }
  );

  return (
    <div className="w-screen h-screen flex flex-col bg-section text-foreground overflow-x-hidden">
      <animated.div
        {...bind()}
        style={{ x, touchAction: 'pan-y' }}
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
      
      <Toaster
        position="top-center"
        containerStyle={{
          top: 123,
        }}
        toastOptions={{
          className: 'text-sm font-medium',
          duration: 3000,
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            padding: '12px 18px',
            width: '80%',
          },
        }}
      />

      <FloatingCartPreview />
      <ScrollRestoration />
    </div>
  );
}