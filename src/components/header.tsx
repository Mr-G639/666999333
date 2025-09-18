// src/components/header.tsx

import { useAtomValue } from "jotai";
import { useLocation, useNavigate } from "react-router-dom";
import { categoriesStateUpwrapped, loadableUserInfoState } from "@/state";
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
    navigate(-1);
  };

  const hasLogo = handle?.logo;
  const hasSearch = handle?.search;
  const hasExtraContent = hasLogo || hasSearch;

  return (
    <div
      // Sửa lỗi: Chiều cao header linh hoạt
      className={`w-full flex flex-col px-4 bg-primary text-primaryForeground pt-st overflow-hidden bg-no-repeat bg-right-top ${
        hasExtraContent ? 'h-28' : 'h-auto'
      }`}
      style={{
        backgroundImage: `url(${headerIllus})`,
      }}
    >
      <div className="w-full min-h-12 flex py-2 space-x-2 items-center">
        {hasLogo ? (
          <>
            <img src={logo} className="flex-none w-8 h-8 rounded-full" alt="App Logo" />
            <TransitionLink to="/stations" className="flex-1 overflow-hidden">
              <div className="flex items-center space-x-1">
                <h1 className="text-lg font-bold">{getConfig((c) => c.template.shopName)}</h1>
                <Icon icon="zi-chevron-right" />
              </div>
              <p className="overflow-x-auto whitespace-nowrap text-2xs">{getConfig((c) => c.template.shopAddress)}</p>
            </TransitionLink>
          </>
        ) : (
          // Sửa lỗi: Căn giữa tiêu đề một cách chính xác
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
      {hasSearch && (
        <div className="w-full py-1 flex space-x-2">
          <SearchBar
            onFocus={() => {
              if (location.pathname !== "/search") {
                navigate("/search", { viewTransition: true });
              }
            }}
          />
          <TransitionLink to="/profile">
            {userInfo.state === "hasData" && userInfo.data ? (
              <img className="w-8 h-8 rounded-full" src={userInfo.data.avatar} alt="User Avatar" />
            ) : (
              <DefaultUserAvatar width={32} height={32} className={userInfo.state === "loading" ? "animate-pulse" : ""} />
            )}
          </TransitionLink>
        </div>
      )}
    </div>
  );
}