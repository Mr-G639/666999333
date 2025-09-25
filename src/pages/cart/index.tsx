// src/pages/cart/index.tsx

import { FC, Suspense } from "react";
import { Box, Page } from "zmp-ui"; // SỬA LỖI: Đã xóa các import không dùng đến
import CartLoading from "@/components/skeleton"; // SỬA LỖI: Sửa cú pháp import
import CartSummary from "./cart-summary"; // SỬA LỖI: Sửa cú pháp import
import { useNavigate } from "react-router-dom"; // SỬA LỖI: Đã xóa useLocation
import CartList from "./cart-list"; // SỬA LỖI: Sửa cú pháp import
import { useAtomValue } from "jotai"; // SỬA LỖI: Dùng Jotai thay cho Recoil
import { cartState } from "@/state";

const CartPage: FC = () => {
  const navigate = useNavigate();
  const cart = useAtomValue(cartState); // SỬA LỖI: Dùng useAtomValue

  return (
    <Page className="flex flex-col">
      <Box className="flex-1 overflow-y-auto">
        <Suspense fallback={<CartLoading />}>
          <CartList />
        </Suspense>
      </Box>
      {cart.length > 0 && (
        <CartSummary
          onClick={() => navigate("/cart/delivery")}
        />
      )}
    </Page>
  );
};

export default CartPage;