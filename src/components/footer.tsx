// src/components/footer.tsx

import { Icon } from "zmp-ui"; // SỬA LỖI: Import Icon từ zmp-ui
import HorizontalDivider from "./horizontal-divider";
import TransitionLink from "./transition-link";
import { useRouteHandle } from "@/hooks/useUtility";
import { useLocation } from "react-router-dom";

// SỬA LỖI: Dùng trực tiếp component Icon của zmp-ui
const NAV_ITEMS = [
  {
    name: "Trang chủ",
    path: "/",
    icon: <Icon icon="zi-home" />,
  },
  {
    name: "Flash Sale",
    path: "/flash-sale",
    icon: <Icon icon="zi-star" />,
  },
];

export default function Footer() {
  const [handle] = useRouteHandle();
  const location = useLocation();

  if (handle?.noFooter) {
    return null;
  }
  
  return (
    <>
      <HorizontalDivider />
      <div
        className="w-full px-4 pt-2 grid pb-sb bg-white"
        style={{
          gridTemplateColumns: `repeat(${NAV_ITEMS.length}, 1fr)`,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <TransitionLink
              to={item.path}
              key={item.path}
              replace
              className="flex flex-col items-center space-y-0.5 p-1 pb-0.5 cursor-pointer active:scale-105"
            >
              <>
                <div className={`w-6 h-6 flex justify-center items-center ${isActive ? "text-primary" : "text-gray"}`}>
                  {item.icon}
                </div>
                <div
                  className={`text-2xs ${isActive ? "text-primary" : "text-gray"}`}
                >
                  {item.name}
                </div>
              </>
            </TransitionLink>
          );
        })}
      </div>
    </>
  );
}