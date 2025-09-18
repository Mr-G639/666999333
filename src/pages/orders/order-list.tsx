// src/pages/orders/order-list.tsx

import { Order } from "@/types";
import { useAtomValue, useSetAtom, WritableAtom } from "jotai";
import { loadable } from "jotai/utils";
import { useMemo } from "react";
import { EmptyOrder } from "@/components/empty";
import ErrorMessage from "@/components/error-message";
import OrderSummary from "./order-summary";
import { OrderSummarySkeleton } from "@/components/skeleton";

// Định nghĩa kiểu cho props của component để tăng tính rõ ràng.
// `ordersState` là một atom có thể ghi và làm mới (refreshable), chứa một promise trả về mảng Order.
interface OrderListProps {
  ordersState: WritableAtom<Promise<Order[]>, [void], void>;
}

/**
 * Component hiển thị danh sách các đơn hàng dựa trên một atom trạng thái.
 * Nó xử lý các trạng thái: đang tải, có lỗi, không có dữ liệu, và có dữ liệu.
 * @param {OrderListProps} props - Props của component, chứa atom trạng thái đơn hàng.
 */
function OrderList(props: OrderListProps) {
  // Sử dụng `useMemo` để đảm bảo `loadable` chỉ được gọi một lần cho mỗi atom, giúp tối ưu hiệu năng.
  const orderListLoadable = useAtomValue(
    useMemo(() => loadable(props.ordersState), [props.ordersState])
  );

  // Lấy hàm `set` của atom, dùng để kích hoạt việc tải lại dữ liệu (refresh).
  const refreshOrders = useSetAtom(props.ordersState);

  // 1. Xử lý trạng thái lỗi: Hiển thị thông báo và nút thử lại.
  if (orderListLoadable.state === "hasError") {
    return (
      <ErrorMessage
        message="Không thể tải danh sách đơn hàng."
        onRetry={() => refreshOrders()} // Gọi hàm refresh khi người dùng nhấn "Thử lại".
      />
    );
  }

  // 2. Refactor: Xử lý trạng thái đang tải một cách tường minh.
  if (orderListLoadable.state === "loading") {
    return (
      <div className="space-y-2 p-4">
        <OrderSummarySkeleton />
        <OrderSummarySkeleton />
        <OrderSummarySkeleton />
      </div>
    );
  }
  
  // 3. Xử lý trạng thái có dữ liệu nhưng danh sách rỗng.
  if (orderListLoadable.state === "hasData" && orderListLoadable.data.length === 0) {
    return <EmptyOrder />;
  }

  // 4. Trạng thái mặc định: có dữ liệu và hiển thị danh sách các đơn hàng.
  return (
    <div className="space-y-2 p-4">
      {orderListLoadable.data.map((order) => (
        <OrderSummary key={order.id} order={order} />
      ))}
    </div>
  );
}

export default OrderList;