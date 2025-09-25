// src/pages/cart/delivery-summary.tsx

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Page, Text } from "zmp-ui";
// [SỬA LỖI] Quay lại sử dụng import zmp mặc định
import zmp from "zmp-sdk";

import {
  cartState,
  newOrdersState,
  cartTotalState,
  cartDetailsState,
  deliveryModeState,
  shippingAddressState,
  selectedStationState,
} from "@/state";
import { Order } from "@/types";
import { formatPrice } from "@/utils/format";
import HorizontalDivider from "@/components/horizontal-divider";
import { getFinalPrice } from "@/utils/cart";

// Component con để tóm tắt đơn hàng
function OrderSummary() {
  const totals = useAtomValue(cartTotalState);
  return (
    <Box className="p-4 space-y-3">
      <Text className="text-lg font-semibold">Tóm tắt đơn hàng</Text>
      <div className="flex justify-between">
        <Text>Tổng tạm tính</Text>
        <Text>{formatPrice(totals.totalAmount)}</Text>
      </div>
      <div className="flex justify-between">
        <Text>Phí vận chuyển</Text>
        <Text className="text-primary font-medium">Miễn phí</Text>
      </div>
      <HorizontalDivider />
      <div className="flex justify-between font-semibold">
        <Text>Tổng cộng</Text>
        <Text>{formatPrice(totals.finalAmount)}</Text>
      </div>
    </Box>
  );
}

// Component chính
const DeliverySummaryContent = () => {
  const cart = useAtomValue(cartDetailsState);
  const totals = useAtomValue(cartTotalState);
  const deliveryMode = useAtomValue(deliveryModeState);
  const shippingAddress = useAtomValue(shippingAddressState);
  const selectedStation = useAtomValue(selectedStationState);
  const [newOrders, setNewOrders] = useAtom(newOrdersState);
  const resetCart = useSetAtom(cartState);

  const navigate = useNavigate();

  const createOrder = () => {
    if (deliveryMode === 'shipping' && !shippingAddress) {
      console.error("Lỗi logic: Địa chỉ giao hàng bị thiếu.");
      return;
    }
    if (deliveryMode === 'pickup' && !selectedStation) {
      console.error("Lỗi logic: Điểm nhận hàng bị thiếu.");
      return;
    }

    const newOrder: Order = {
      id: Math.floor(Math.random() * 100000),
      items: cart,
      createdAt: new Date().toISOString(),
      status: 'pending',
      total: totals.finalAmount,
      paymentStatus: 'pending',
      delivery: deliveryMode === 'shipping'
        ? { type: 'shipping', ...shippingAddress! }
        : {
            type: 'pickup',
            name: selectedStation!.name,
            address: selectedStation!.address,
          },
      note: '',
      receivedAt: '',
    };

    setNewOrders([...newOrders, newOrder]);
    // @ts-ignore
    resetCart("RESET");

    navigate("/orders", { state: { newOrder: true } });

    // [SỬA LỖI] Bỏ qua lỗi định nghĩa kiểu của SDK và gọi API zmp.openApp
    // @ts-ignore 
    zmp.openApp({
      appID: '2585606122290030502',
      path: 'order/success',
      params: { orderId: newOrder.id.toString() }
    }).catch((err: unknown) => console.error("Không thể mở App khác:", err));
  };

  return (
    <Page className="flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <Box className="p-4 m-4 rounded-lg">
          <Text className="text-lg font-semibold mb-3">Sản phẩm</Text>
          {cart.map((item) => (
            <div key={item.product.id} className="flex items-center space-x-3 py-2">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <Text size="small" className="line-clamp-1">{item.product.name}</Text>
                <Text size="xSmall" className="text-gray-500">
                  SL: {item.quantity}
                </Text>
              </div>
              <Text size="small" className="font-medium">
                {formatPrice(getFinalPrice(item.product) * item.quantity)}
              </Text>
            </div>
          ))}
        </Box>

        <Suspense fallback={<Box className="p-4">Đang tính toán...</Box>}>
          <OrderSummary />
        </Suspense>
      </div>

      <Box className="p-4 sticky bottom-0 bg-white">
        <Button fullWidth onClick={createOrder} disabled={cart.length === 0}>
          Xác nhận ({formatPrice(totals.finalAmount)})
        </Button>
      </Box>
    </Page>
  );
}

export default DeliverySummaryContent;