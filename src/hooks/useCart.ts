// src/hooks/useCart.ts

import { useSetAtom, useAtomValue } from "jotai";
import { selectAtom } from 'jotai/utils';
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { 
  cartState, 
  userVouchersState, 
  cartDetailsState, // SỬA LỖI: Luôn dùng atom này để đọc giỏ hàng chi tiết
} from "@/state";
import { Product, CartItem, Voucher } from "@/types";
import { getFinalPrice } from "@/utils/cart";

/**
 * @typedef CartSummary
 * @type {object}
 * @property {CartItem[]} cart - Danh sách các sản phẩm trong giỏ (đã có đủ thông tin).
 * @property {number} totalPrice - Tổng giá trị đơn hàng (chưa giảm giá).
 * @property {number} totalQuantity - Tổng số lượng sản phẩm.
 * @property {number} finalPrice - Giá cuối cùng sau khi đã áp dụng voucher.
 * @property {Voucher[]} appliedVouchers - Danh sách các voucher đã được áp dụng.
 */
type CartSummary = {
  cart: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  finalPrice: number;
  appliedVouchers: Voucher[];
};

/**
 * Hook để đọc toàn bộ trạng thái của giỏ hàng và các giá trị tính toán liên quan.
 * Component sử dụng hook này sẽ re-render khi giỏ hàng hoặc voucher thay đổi.
 * @returns {CartSummary} Thông tin chi tiết về giỏ hàng.
 */
export function useCart(): CartSummary {
  // SỬA LỖI: Dùng `cartDetailsState` để lấy `CartItem[]` hoàn chỉnh, không phải `CartItemIdentifier[]`
  const cart = useAtomValue(cartDetailsState);
  const vouchers = useAtomValue(userVouchersState);

  const summary = useMemo(() => {
    // Logic tính toán giờ đây hoàn toàn chính xác vì `cart` đã có đầy đủ `product`
    const calculatedTotalPrice = cart.reduce(
      (acc, currentItem) => acc + getFinalPrice(currentItem.product) * currentItem.quantity,
      0
    );

    const calculatedTotalQuantity = cart.reduce(
      (acc, currentItem) => acc + currentItem.quantity,
      0
    );

    const totalDiscount = vouchers.reduce(
      (acc, voucher) => acc + (voucher.discountValue ?? 0),
      0
    );

    const calculatedFinalPrice = Math.max(0, calculatedTotalPrice - totalDiscount);

    return {
      totalPrice: calculatedTotalPrice,
      totalQuantity: calculatedTotalQuantity,
      finalPrice: calculatedFinalPrice,
    };
  }, [cart, vouchers]);

  return {
    cart,
    ...summary,
    appliedVouchers: vouchers,
  };
}

/**
 * @typedef CartActions
 * @type {object}
 * @property {(product: Product, quantity: number, options?: { toast?: boolean }) => void} updateCart - Thêm, cập nhật, hoặc xóa sản phẩm khỏi giỏ.
 */
type CartActions = {
  updateCart: (product: Product, quantity: number, options?: { toast?: boolean }) => void;
};

/**
 * Hook chuyên cung cấp các hành động (ghi) để thay đổi giỏ hàng.
 * Component sử dụng hook này sẽ không re-render khi `cartState` thay đổi.
 * @returns {CartActions} Các hàm để thao tác với giỏ hàng.
 */
export function useCartActions(): CartActions {
  // Tương tác ghi sẽ thực hiện trên `cartState` (state gốc chỉ chứa ID)
  const setCart = useSetAtom(cartState);

  const updateCart = useCallback((product: Product, quantity: number, options?: { toast?: boolean }) => {
    setCart((currentCart) => {
      // SỬA LỖI: Tìm kiếm item trong giỏ hàng dựa trên `productId`
      const itemIndex = currentCart.findIndex(
        (item) => item.productId === product.id
      );

      if (itemIndex > -1) {
        if (quantity <= 0) {
          // Xóa sản phẩm
          return currentCart.filter((_, index) => index !== itemIndex);
        }
        // Cập nhật số lượng
        return currentCart.map((item, index) =>
          index === itemIndex ? { ...item, quantity } : item
        );
      }
      
      if (quantity > 0) {
        // SỬA LỖI: Thêm item mới vào giỏ hàng với đúng cấu trúc `productId`
        return [...currentCart, { productId: product.id, quantity }];
      }

      return currentCart;
    });

    if (options?.toast && quantity > 0) {
      toast.success("Đã cập nhật giỏ hàng", {
        id: 'update-cart-toast',
      });
    }
  }, [setCart]);

  return { updateCart };
}

/**
 * Hook hiệu năng cao chuyên để đọc số lượng của một sản phẩm cụ thể trong giỏ hàng.
 * Component sử dụng hook này sẽ CHỈ re-render khi số lượng của chính sản phẩm đó thay đổi.
 * @param {number} productId - ID của sản phẩm cần lấy số lượng.
 * @returns {number} Số lượng của sản phẩm trong giỏ hàng, mặc định là 0.
 */
export function useCartItemQuantity(productId: number): number {
  const quantityAtom = useMemo(
    () =>
      selectAtom(
        cartState,
        // SỬA LỖI: Tìm kiếm trên `cartState` gốc dựa trên `productId`
        (cart) =>
          cart.find((item) => item.productId === productId)?.quantity ?? 0
      ),
    [productId]
  );

  return useAtomValue(quantityAtom);
}