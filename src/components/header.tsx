// src/components/header.tsx

import { useAtomValue } from "jotai";
import { useLocation, useNavigate } from "react-router-dom";
import {
  categoriesStateUpwrapped,
  loadableUserInfoState,
} from "@/state";
import { useMemo } from "react";
import { useRouteHandle } from "@/hooks/useUtility";
import { getConfig } from "@/utils/template";
import headerIllus from "@/static/header-illus.svg";
import SearchBar from "./search-bar";
import TransitionLink from "./transition-link";
import { Icon } from "zmp-ui";
import { DefaultUserAvatar } from "./vectors";
import logo from "@/static/logo.png";

export default function Header() {
  const categories = useAtomValue(categoriesStateUpwrapped);
  const navigate = useNavigate();
  const location = useLocation();
  const [handle, matchRaw] = useRouteHandle();

  if (handle?.noHeader) {
    return null;
  }

  const match = matchRaw && typeof matchRaw === "object" && "params" in matchRaw
    ? matchRaw
    : { params: {} };
  const userInfo = useAtomValue(loadableUserInfoState);

  const title = useMemo(() => {
    if (handle && handle.title !== undefined) {
      if (typeof handle.title === "function") {
        return (handle.title as (args: any) => string)({ categories, params: match.params });
      } else {
        return handle.title;
      }
    }
    return undefined;
  }, [handle, categories, match.params]);

  const showBack = location.key !== "default" && !handle?.noBack;

  const handleBackClick = () => {
    const path = location.pathname;
    // Nếu đang ở trang danh mục hoặc trang danh sách đơn hàng, thì quay về trang chủ
    if (path.startsWith('/category/') || path.startsWith('/orders')) {
      navigate('/');
    } else {
      // Đối với các trường hợp khác (bao gồm chi tiết đơn hàng), quay lại trang trước đó
      navigate(-1);
    }
  };

  return (
    <div
      className="w-full flex flex-col px-4 bg-primary text-primaryForeground pt-st overflow-hidden bg-no-repeat bg-right-top"
      style={{
        backgroundImage: `url(${headerIllus})`,
      }}
    >
      <div className="w-full min-h-12 pr-[90px] flex py-2 space-x-2 items-center">
        {handle?.logo ? (
          <>
            <img
              src={logo}
              className="flex-none w-8 h-8 rounded-full"
              alt="App Logo"
            />
            <TransitionLink to="/stations" className="flex-1 overflow-hidden">
              <div className="flex items-center space-x-1">
                <h1 className="text-lg font-bold">
                  {getConfig((c) => c.template.shopName)}
                </h1>
                <Icon icon="zi-chevron-right" />
              </div>
              <p className="overflow-x-auto whitespace-nowrap text-2xs">
                {getConfig((c) => c.template.shopAddress)}
              </p>
            </TransitionLink>
          </>
        ) : (
          <>
            {showBack && (
              <div
                className="py-1 px-2 cursor-pointer"
                onClick={handleBackClick}
              >
                <Icon icon="zi-arrow-left" />
              </div>
            )}
            <div className="text-xl font-medium truncate">{title}</div>
          </>
        )}
      </div>
      {handle?.search && (
        <div className="w-full py-2 flex space-x-2">
          <SearchBar
            onFocus={() => {
              if (location.pathname !== "/search") {
                navigate("/search", { viewTransition: true });
              }
            }}
          />
          <TransitionLink to="/profile">
            {userInfo.state === "hasData" && userInfo.data ? (
              <img
                className="w-8 h-8 rounded-full"
                src={userInfo.data.avatar}
                alt="User Avatar"
              />
            ) : (
              <DefaultUserAvatar
                width={32}
                height={32}
                className={userInfo.state === "loading" ? "animate-pulse" : ""}
              />
            )}
          </TransitionLink>
        </div>
      )}
    </div>
  );
}