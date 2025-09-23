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
import { CartIcon, DefaultUserAvatar } from "./vectors";

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

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [handle] = useRouteHandle();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  
  const userInfo = useAtomValue(loadableUserInfoState);
  const title = useMemo(() => {
    if (typeof handle?.title === "function") {
      return (handle.title as any)({} as any); 
    }
    return handle?.title;
  }, [handle]);

  const orderStatusCounts = { paid: 1, shipping: 2, history: 10 };
  const newsTickerData = ["Chào mừng bạn đến với ZAUI Market!", "Miễn phí vận chuyển cho đơn hàng từ 200K."];
  const marqueeString = newsTickerData.join("   •••   ");

  if (handle?.noHeader) {
    return null;
  }

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
                <div className="flex w-full items-center space-x-3">
                  <TransitionLink to="/profile">
                    {userInfo.state === "hasData" && userInfo.data ? (
                      <img className="h-8 w-8 rounded-full flex-none" src={userInfo.data.avatar} alt="User Avatar" />
                    ) : (
                      <DefaultUserAvatar width={32} height={32} className={`flex-none ${userInfo.state === 'loading' ? 'animate-pulse' : ''}`} />
                    )}
                  </TransitionLink>
                  <div className="flex-1">
                    <SearchBar onClick={() => navigate('/search')} />
                  </div>
                  <div className="flex items-center space-x-3 flex-none">
                    <Icon icon="zi-chat" size={27} />
                    <div className="cursor-pointer w-[27px] h-[27px]" onClick={() => navigate('/cart')}>
                      <CartIcon />
                    </div>
                  </div>
                </div>
                <div className="w-full overflow-hidden">
                  <MarqueeText text={marqueeString} />
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <OrderStatusItem label="Đã thanh toán" count={orderStatusCounts.paid} onClick={() => navigate("/orders/paid")} />
                    <OrderStatusItem label="Đang vận chuyển" count={orderStatusCounts.shipping} onClick={() => navigate("/orders/shipping")} />
                    <OrderStatusItem label="Lịch sử" count={0} onClick={() => navigate("/orders/history")} />
                  </div>
                  <div className="cursor-pointer" onClick={() => setIsPopupVisible(true)}>
                    <Icon icon="zi-list-1" size={27} />
                  </div>
                </div>
              </>
            ) : (
              <div className="relative flex w-full items-center justify-center h-[44px]">
                {showBack && (
                  <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2">
                    <div className="cursor-pointer p-2" onClick={handleBackClick}>
                      <Icon icon="zi-arrow-left" />
                    </div>
                  </div>
                )}
                <div className="flex-1 truncate text-center text-xl font-medium">
                  {title}
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