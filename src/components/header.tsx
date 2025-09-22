import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadableUserInfoState } from "@/state";
import { useRouteHandle } from "@/hooks/useUtility";
import { Icon } from "zmp-ui";
import CategoryPopup from "./category-popup";
import MarqueeText from "./marquee-text";
import SearchBar from "./search-bar";
import TransitionLink from "./transition-link";
import { DefaultUserAvatar } from "./vectors";

// Component con cho từng trạng thái đơn hàng
const OrderStatusItem = ({ label, count, onClick }: { label: string; count: number, onClick: () => void }) => (
  <div className="relative cursor-pointer rounded-full bg-white bg-opacity-20 px-3 py-1" onClick={onClick}>
    <span className="text-xs font-medium text-white">{label}</span>
    {count > 0 && (
      <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
        {count}
      </div>
    )}
  </div>
);

/**
 * Header động của ứng dụng.
 */
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [handle] = useRouteHandle();

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Dữ liệu giả lập
  const orderStatusCounts = {
    paid: 1,
    shipping: 2,
    history: 10,
  };
  const newsTickerData = [
    "Chào mừng bạn đến với ZAUI Market!",
    "Miễn phí vận chuyển cho đơn hàng từ 200K.",
  ];
  const marqueeString = newsTickerData.join("  •••  ");

  if (handle?.noHeader) {
    return null;
  }

  const userInfo = useAtomValue(loadableUserInfoState);
  const title = useMemo(() => handle?.title, [handle]);
  const showBack = location.key !== "default" && !handle?.noBack;

  const handleBackClick = () => {
    if (handle?.backTo) {
      navigate(handle.backTo);
    } else {
      navigate(-1);
    }
  };

  const hasSearch = handle?.search;

  return (
    <>
      <div className="sticky top-0 z-20 w-full bg-primary text-primaryForeground">
        <div className="pt-safe-area-top">
          <div className="flex w-full min-h-28 flex-col justify-start space-y-0.5 px-3 pt-9 pb-1">
            {hasSearch ? (
              <>
                {/* TẦNG 1: ICON CHỨC NĂNG VÀ THANH TÌM KIẾM */}
                <div className="flex w-full items-center space-x-3">
                  <div className="flex flex-none items-center space-x-3">
                    <div className="cursor-pointer" onClick={() => setIsPopupVisible(true)}>
                      <Icon icon="zi-list-1" size={27} />
                    </div>
                    <TransitionLink to="/profile">
                      {userInfo.state === "hasData" && userInfo.data ? (
                        <img className="h-8 w-8 rounded-full" src={userInfo.data.avatar} alt="User Avatar" />
                      ) : (
                        <DefaultUserAvatar width={32} height={32} className={userInfo.state === 'loading' ? 'animate-pulse' : ''} />
                      )}
                    </TransitionLink>
                  </div>
                  <div className="flex-1">
                    <SearchBar
                      onFocus={() => {
                        if (location.pathname !== "/search") {
                          navigate("/search");
                        }
                      }}
                    />
                  </div>
                </div>

                {/* TẦNG 2: TIN TỨC CHẠY */}
                <div className="w-full overflow-hidden">
                  <MarqueeText text={marqueeString} />
                </div>
                
                {/* TẦNG 3: TRẠNG THÁI ĐƠN HÀNG */}
                <div className="flex w-full items-center justify-center space-x-2">
                  <OrderStatusItem label="Đã thanh toán" count={orderStatusCounts.paid} onClick={() => navigate("/orders?status=paid")} />
                  <OrderStatusItem label="Đang vận chuyển" count={orderStatusCounts.shipping} onClick={() => navigate("/orders?status=shipping")} />
                  <OrderStatusItem label="Lịch sử" count={0} onClick={() => navigate("/orders?status=history")} />
                </div>
              </>
            ) : (
              // Layout Header cho các trang con
              <div className="flex w-full items-center">
                {showBack && (
                  <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
                    <div className="cursor-pointer p-2" onClick={handleBackClick}>
                      <Icon icon="zi-arrow-left" />
                    </div>
                  </div>
                )}
                <div className="flex-1 truncate text-center text-xl font-medium">
                  {typeof title === "function" ? (title as () => React.ReactNode)() : title}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <CategoryPopup visible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
    </>
  );
}