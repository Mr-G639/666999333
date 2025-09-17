import { useAtomValue, useAtom, useSetAtom } from "jotai";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  cartTotalState,
  cartState,
  ordersState,
  selectedVoucherState, // Thêm import này
} from "@/state";
import { useRequestInformation } from "./useUser";
import { createOrder } from "zmp-sdk/apis";

export function useCheckout() {
  const { finalAmount } = useAtomValue(cartTotalState); // Sửa thành finalAmount
  const [cart, setCart] = useAtom(cartState);
  const selectedVoucher = useAtomValue(selectedVoucherState); // Lấy voucher
  const requestInfo = useRequestInformation();
  const navigate = useNavigate();
  const refreshNewOrders = useSetAtom(ordersState("pending"));

  return async () => {
    try {
      await requestInfo();
      await createOrder({
        amount: finalAmount, // Sử dụng finalAmount
        desc: `Thanh toán đơn hàng. ${
          selectedVoucher ? `Sử dụng voucher ${selectedVoucher.code}` : ""
        }`,
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