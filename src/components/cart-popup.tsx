// src/components/cart-popup.tsx

import { FC, Suspense } from "react";
import { Box, Sheet } from "zmp-ui";
import { useAtom, useAtomValue } from "jotai";
import { cartPopupVisibleState, cartState } from "@/state";
import CartLoading from "./skeleton";
import CartList from "@/pages/cart/cart-list";
import CartSummary from "@/pages/cart/cart-summary";
import { useNavigate } from "react-router-dom";

export const CartPopup: FC = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useAtom(cartPopupVisibleState);
  const cart = useAtomValue(cartState);

  const handleContinue = () => {
    setVisible(false); // Đóng popup trước khi điều hướng
    navigate("/cart/delivery");
  };

  return (
    <Sheet
      visible={visible}
      onClose={() => setVisible(false)}
      autoHeight
      mask
      handler
      swipeToClose
    >
      <Box className="flex flex-col" style={{ maxHeight: '85vh' }}>
        <Box className="flex-1 overflow-y-auto">
          <Suspense fallback={<CartLoading />}>
            <CartList />
          </Suspense>
        </Box>
        {cart.length > 0 && (
          <CartSummary onClick={handleContinue} />
        )}
      </Box>
    </Sheet>
  );
};