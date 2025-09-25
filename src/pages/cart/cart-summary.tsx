// src/pages/cart/cart-summary.tsx

import { FC } from "react";
import { Box, Button, Text } from "zmp-ui";
import { useAtomValue } from "jotai";
import { cartTotalState } from "@/state"; // SỬA LỖI: Import đúng tên state
import { formatPrice } from "@/utils/format"; // SỬA LỖI: Import đúng hàm formatPrice

// Định nghĩa props để component có thể nhận onClick
interface CartSummaryProps {
  onClick: () => void;
}

const CartSummary: FC<CartSummaryProps> = ({ onClick }) => {
  // SỬA LỖI: Lấy tổng tiền từ state đúng
  const cartTotal = useAtomValue(cartTotalState);

  return (
    <Box className="sticky bottom-0 bg-white p-4">
      <Box flex justifyContent="space-between" alignItems="center">
        <Box>
          {/* SỬA LỖI: Sử dụng Text và hàm formatPrice với đúng thuộc tính 'finalAmount' */}
          <Text className="text-xl font-bold">{formatPrice(cartTotal.finalAmount)}</Text>
        </Box>
        <Button size="large" onClick={onClick}>
          Tiếp tục
        </Button>
      </Box>
    </Box>
  );
};

export default CartSummary;