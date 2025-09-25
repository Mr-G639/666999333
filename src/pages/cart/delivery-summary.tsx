// src/pages/cart/delivery-summary.tsx

import { FC, MouseEvent } from "react";
import { Box, Button, Icon, Text } from "zmp-ui";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { cartState, newOrdersState, selectedVoucherState, shippingAddressState, cartTotalState } from "@/state";
import { useNavigate } from "react-router-dom";
import HorizontalDivider from "@/components/horizontal-divider";
import { formatPrice } from "@/utils/format";
import toast from "react-hot-toast";
import { Order } from "@/types";

const DeliverySummary: FC = () => {
  const navigate = useNavigate();
  const cart = useAtomValue(cartState);
  const address = useAtomValue(shippingAddressState);
  const selectedVoucher = useAtomValue(selectedVoucherState);
  const cartTotal = useAtomValue(cartTotalState);
  const setCart = useSetAtom(cartState);
  const [newOrders, setNewOrders] = useAtom(newOrdersState);
  const setSelectedVoucher = useSetAtom(selectedVoucherState);

  const handleClearVoucher = (e: MouseEvent) => {
    e.stopPropagation();
    setSelectedVoucher(undefined);
  };

  const handlePayment = () => {
    if (!address) {
      toast.error("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    const newOrder: Order = {
      id: new Date().getTime(),
      createdAt: new Date().toISOString(),
      status: "pending",
      items: cart, // SỬA LỖI: Thuộc tính đúng là 'items', không phải 'products'
      total: cartTotal.finalAmount,
      // SỬA LỖI: Tạo đúng cấu trúc cho thuộc tính 'delivery'
      delivery: {
        type: "shipping",
        ...address,
      },
      // Thêm các thuộc tính còn thiếu với giá trị mặc định
      paymentStatus: "pending",
      receivedAt: "",
      note: "",
    };

    setNewOrders([...newOrders, newOrder]);
    setCart([]);
    toast.success("Đặt hàng thành công!");
    navigate("/");
  };

  return (
    <Box className="p-4 space-y-4">
        {/* Phần JSX còn lại giữ nguyên */}
        <Box>
            <Text.Title>Địa chỉ nhận hàng</Text.Title>
            <Box
                className="bg-white rounded-lg p-3 mt-2"
                onClick={() => navigate("/shipping-address")}
            >
                {address ? (
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                    <Icon icon="zi-location-solid" className="text-primary" />
                    <Text className="flex-1">{`${address.name}, ${address.phone}, ${address.address}`}</Text>
                    </div>
                    <Icon icon="zi-arrow-right" />
                </div>
                ) : (
                <div className="flex items-center justify-between">
                    <Text>Vui lòng chọn địa chỉ nhận hàng</Text>
                    <Icon icon="zi-arrow-right" />
                </div>
                )}
            </Box>
        </Box>

        <HorizontalDivider />

        <Box>
            <Text.Title>Sản phẩm</Text.Title>
            <Box className="bg-white rounded-lg p-3 mt-2">
                {cart.map((item) => (
                <Box key={item.product.id} className="flex items-center space-x-3 my-2">
                    <img src={item.product.images[0]} className="w-12 h-12 rounded-md" />
                    <Box className="flex-1">
                    <Text size="small">{item.product.name}</Text>
                    <Text size="xSmall" className="text-gray-500">
                        SL: {item.quantity}
                    </Text>
                    </Box>
                    <Text>{formatPrice(item.product.price * item.quantity)}</Text>
                </Box>
                ))}
            </Box>
        </Box>
      
        <HorizontalDivider />

        <Box>
            <Text.Title>Thanh toán</Text.Title>
            <Box className="bg-white rounded-lg p-3 mt-2 space-y-3">
                <div
                className="flex items-center justify-between"
                onClick={() => navigate("/vouchers")}
                >
                <div className="flex items-center space-x-3">
                    <Icon icon="zi-star-solid" className="text-primary" />
                    <Text>
                    {selectedVoucher
                        ? `Voucher: ${selectedVoucher.title}`
                        : "Chọn hoặc nhập mã"}
                    </Text>
                </div>
                {selectedVoucher ? (
                    <div onClick={handleClearVoucher}>
                    <Icon icon="zi-close-circle" />
                    </div>
                ) : (
                    <Icon icon="zi-arrow-right" />
                )}
                </div>
                <HorizontalDivider />
                <div className="flex items-center justify-between">
                <Text>Tạm tính</Text>
                <Text>{formatPrice(cartTotal.totalAmount)}</Text>
                </div>
                {selectedVoucher && (
                <div className="flex items-center justify-between">
                    <Text>Giảm giá</Text>
                    <Text className="text-red-500">{formatPrice(-(cartTotal.totalAmount - cartTotal.finalAmount))}</Text>
                </div>
                )}
                <HorizontalDivider />
                <div className="flex items-center justify-between">
                <Text.Title>Tổng cộng</Text.Title>
                <Text className="text-xl text-primary font-bold">{formatPrice(cartTotal.finalAmount)}</Text>
                </div>
            </Box>
        </Box>

        <Box className="mt-6">
            <Button
                fullWidth
                size="large"
                disabled={!address}
                onClick={handlePayment}
            >
                Xác nhận và Thanh toán
            </Button>
        </Box>
    </Box>
  );
};

export default DeliverySummary;