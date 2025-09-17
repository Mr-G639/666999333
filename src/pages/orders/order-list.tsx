// src/pages/orders/order-list.tsx

import { Order } from "@/types";
// Sửa lỗi: Import thêm WritableAtom
import { useAtomValue, useSetAtom, WritableAtom } from "jotai";
import { loadable } from "jotai/utils";
import { useMemo } from "react";
import { EmptyOrder } from "@/components/empty";
import ErrorMessage from "@/components/error-message";
import OrderSummary from "./order-summary";
import { OrderSummarySkeleton } from "@/components/skeleton";

// Sửa lỗi: Thay đổi kiểu dữ liệu của prop để phản ánh đúng là một atom có thể làm mới
function OrderList(props: {
  ordersState: WritableAtom<Promise<Order[]>, [void], void>;
}) {
  const orderList = useAtomValue(
    useMemo(() => loadable(props.ordersState), [props.ordersState])
  );

  const retryLoadableOrders = useSetAtom(props.ordersState);

  if (orderList.state === "hasError") {
    return (
      <ErrorMessage
        message="Failed to load orders."
        onRetry={() => retryLoadableOrders()} // Sửa lỗi: Gọi hàm refresh
      />
    );
  }

  if (orderList.state === "hasData" && orderList.data.length === 0) {
    return <EmptyOrder />;
  }

  return (
    <div className="space-y-2 p-4">
      {orderList.state !== "hasData" ? (
        <>
          <OrderSummarySkeleton />
          <OrderSummarySkeleton />
          <OrderSummarySkeleton />
        </>
      ) : (
        orderList.data.map((order) => (
          <OrderSummary key={order.id} order={order} />
        ))
      )}
    </div>
  );
}

export default OrderList;