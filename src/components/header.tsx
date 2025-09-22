// src/components/header.tsx

import { useAtomValue } from "jotai";
import { useLocation, useNavigate } from "react-router-dom";
import { categoriesStateUpwrapped, loadableUserInfoState } from "@/state";
import { useMemo, useState } from "react";
import { useRouteHandle } from "@/hooks/useUtility";
import { getConfig } from "@/utils/template";
import SearchBar from "./search-bar";
import TransitionLink from "./transition-link";
import { Icon } from "zmp-ui";
import { DefaultUserAvatar } from "./vectors";
import logo from "@/static/logo.png";
import CategoryPopup from "./category-popup"; // Import component popup

/**
 * Header động của ứng dụng.
 * Tự động thay đổi giao diện dựa trên cấu hình của route hiện tại.
 * Tích hợp nút mở popup danh mục.
 */
export default function Header() {
  const categories = useAtomValue(categoriesStateUpwrapped);
  const navigate = useNavigate();
  const location = useLocation();
  const [handle, matchRaw] = useRouteHandle();

  // State để quản lý việc hiển thị popup danh mục
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Ẩn toàn bộ header nếu có cờ noHeader trong route
  if (handle?.noHeader) {
    return null;
  }

  const match =
    matchRaw && typeof matchRaw === "object" && "params" in matchRaw
      ? matchRaw
      : { params: {} };
  const userInfo = useAtomValue(loadableUserInfoState);

  // Tự động tính toán tiêu đề từ route handle
  const title = useMemo(() => {
    if (handle && handle.title !== undefined) {
      if (typeof handle.title === "function") {
        return (handle.title as (args: any) => string)({
          categories,
          params: match.params,
        });
      }
      return handle.title;
    }
    return undefined;
  }, [handle, categories, match.params]);

  // Hiển thị nút back nếu không phải trang đầu tiên
  const showBack = location.key !== "default" && !handle?.noBack;

  const handleBackClick = () => {
    if (handle?.backTo) {
      navigate(handle.backTo);
    } else {
      navigate(-1);
    }
  };

  const hasLogo = handle?.logo;
  const hasSearch = handle?.search;
  
  return (
    <>
      <div className="w-full bg-primary text-primaryForeground sticky top-0 z-20">
        <div className="pt-safe-area-top">
          {/* Thanh điều hướng chính */}
          <div className="w-full min-h-12 flex py-9 px-3 space-x-3 items-center">
            {hasLogo ? (
              // Layout header cho trang chủ
              <>
                <img src={logo} className="flex-none w-9 h-9 rounded-full" alt="App Logo" />
                <TransitionLink to="/stations" className="flex-1 overflow-hidden">
                  <div className="flex items-center space-x-1">
                    <h1 className="text-lg font-bold">{getConfig((c) => c.template.shopName)}</h1>
                    <Icon icon="zi-chevron-right" />
                  </div>
                  <p className="overflow-x-auto whitespace-nowrap text-xs scrollbar-hide">
                    {getConfig((c) => c.template.shopAddress)}
                  </p>
                </TransitionLink>
              </>
            ) : (
              // Layout header cho các trang con
              <div className="flex-1 flex items-center relative">
                {showBack && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                    <div className="p-2 -ml-2 cursor-pointer" onClick={handleBackClick}>
                      <Icon icon="zi-arrow-left" />
                    </div>
                  </div>
                )}
                <div className="text-xl font-medium truncate flex-1 text-center">{title}</div>
              </div>
            )}
          </div>

          {/* Thanh tìm kiếm và các icon chức năng */}
          {hasSearch && (
            <div className="w-full py-0 px-3 mb-0 flex items-center space-x-6">
              <SearchBar
                onFocus={() => {
                  if (location.pathname !== "/search") {
                    // SỬA LỖI: Xóa bỏ tùy chọn không hợp lệ
                    navigate("/search");
                  }
                }}
              />
              {/* NÚT MỞ POPUP DANH MỤC */}
              <div
                className="flex-none flex flex-col items-center justify-center text-white space-y-1"
                onClick={() => setIsPopupVisible(true)}
              >
                <Icon icon="zi-list-1" size={27}/>
                <span className="text-[10px] font-medium">Danh mục</span>
              </div>
              <TransitionLink to="/profile" className="flex-none">
                {userInfo.state === "hasData" && userInfo.data ? (
                  <img className="w-8 h-8 rounded-full" src={userInfo.data.avatar} alt="User Avatar" />
                ) : (
                  <DefaultUserAvatar width={32} height={32} className={userInfo.state === 'loading' ? 'animate-pulse' : ''} />
                )}
              </TransitionLink>
            </div>
          )}
        </div>
      </div>
      
      {/* Component Popup Danh mục */}
      <CategoryPopup
        visible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
      />
    </>
  );
}