// src/hooks.ts

import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { MutableRefObject, useCallback, useLayoutEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { UIMatch, useMatches, useNavigate } from "react-router-dom";
import {
  cartState,
  cartTotalState,
  ordersState,
  userInfoKeyState,
  userInfoState,
} from "@/state";
import { Product } from "@/types";
import { getConfig } from "@/utils/template";
import { authorize, createOrder, openChat } from "zmp-sdk/apis";
import { useAtomCallback } from "jotai/utils";

// ==================================================================
// CÁC CUSTOM HOOK ĐÃ ĐƯỢC KHÔI PHỤC
// ==================================================================

export function useRealHeight(
  element: MutableRefObject<HTMLDivElement | null>,
  defaultValue?: number
) {
  const [height, setHeight] = useState(defaultValue ?? 0);
  useLayoutEffect(() => {
    if (element.current && typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        const [{ contentRect }] = entries;
        setHeight(contentRect.height);
      });
      ro.observe(element.current);
      return () => ro.disconnect();
    }
    return () => {};
  }, [element.current]);

  if (typeof ResizeObserver === "undefined") {
    return -1;
  }
  return height;
}

export function useRequestInformation() {
  const getStoredUserInfo = useAtomCallback(async (get) => {
    const userInfo = await get(userInfoState);
    return userInfo;
  });
  const setInfoKey = useSetAtom(userInfoKeyState);
  const refreshPermissions = () => setInfoKey((key) => key + 1);

  return async () => {
    const userInfo = await getStoredUserInfo();
    if (!userInfo) {
      await authorize({
        scopes: ["scope.userInfo", "scope.userPhonenumber"],
      }).then(refreshPermissions);
      return await getStoredUserInfo();
    }
    return userInfo;
  };
}

// ==================================================================
// HOOK useAddToCart ĐÃ ĐƯỢC SỬA LỖI
// ==================================================================

export function useAddToCart(product: Product) {
  const [cart, setCart] = useAtom(cartState);

  const cartQuantity = useMemo(
    () => cart.find((item) => item.product.id === product.id)?.quantity ?? 0,
    [cart, product.id]
  );

  const addToCart = useCallback((newQuantity: number, options?: { toast: boolean }) => {
    setCart((currentCart) => {
      const newCart = [...currentCart];
      const itemIndex = newCart.findIndex(
        (item) => item.product.id === product.id
      );

      if (newQuantity <= 0) {
        if (itemIndex > -1) {
          newCart.splice(itemIndex, 1);
        }
      } else {
        if (itemIndex > -1) {
          newCart[itemIndex] = { ...newCart[itemIndex], quantity: newQuantity };
        } else {
          newCart.push({ product, quantity: newQuantity });
        }
      }
      return newCart;
    });

    if (options?.toast) {
      toast.success("Đã thêm vào giỏ hàng");
    }
  }, [product, setCart]);

  return { addToCart, cartQuantity };
}

// ==================================================================
// CÁC CUSTOM HOOK ĐÃ ĐƯỢC KHÔI PHỤC
// ==================================================================

export function useCustomerSupport() {
  return () =>
    openChat({
      type: "oa",
      id: getConfig((config) => config.template.oaIDtoOpenChat),
    });
}

export function useToBeImplemented() {
  return () =>
    toast("Chức năng dành cho các bên tích hợp phát triển...", {
      icon: "🛠️",
    });
}

export function useCheckout() {
  const { totalAmount } = useAtomValue(cartTotalState);
  const [cart, setCart] = useAtom(cartState);
  const requestInfo = useRequestInformation();
  const navigate = useNavigate();
  const refreshNewOrders = useSetAtom(ordersState("pending"));

  return async () => {
    try {
      await requestInfo();
      await createOrder({
        amount: totalAmount,
        desc: "Thanh toán đơn hàng",
        item: cart.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
      });
      setCart([]);
      refreshNewOrders();
      navigate("/orders", {
        viewTransition: true,
      });
      toast.success("Thanh toán thành công. Cảm ơn bạn đã mua hàng!", {
        icon: "🎉",
        duration: 5000,
      });
    } catch (error) {
      console.warn(error);
      toast.error(
        "Thanh toán thất bại. Vui lòng kiểm tra nội dung lỗi bên trong Console."
      );
    }
  };
}

type RouteHandle = {
  title?: string | Function;
  logo?: boolean;
  search?: boolean;
  noFooter?: boolean;
  noBack?: boolean;
  noFloatingCart?: boolean;
  scrollRestoration?: number;
};

export function useRouteHandle() {
  const matches = useMatches() as UIMatch<undefined, RouteHandle | undefined>[];
  const lastMatch = matches[matches.length - 1];

  return [lastMatch.handle, lastMatch, matches] as const;
}