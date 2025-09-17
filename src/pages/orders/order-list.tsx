import { Order } from "@/types";
import { Atom, useAtomValue, useSetAtom } from "jotai";
import { loadable } from "jotai/utils";
import { useMemo } from "react";
import { EmptyOrder } from "@/components/empty";
import ErrorMessage from "@/components/error-message";
import OrderSummary from "./order-summary";
import { OrderSummarySkeleton } from "@/components/skeleton";

function OrderList(props: { ordersState: Atom<Promise<Order[]>> }) {
  const orderList = useAtomValue(
    useMemo(() => loadable(props.ordersState), [props.ordersState])
  );

  const retryLoadableOrders = useSetAtom(props.ordersState);

  if (orderList.state === "hasError") {
    return (
      <ErrorMessage
        message="Failed to load orders."
        onRetry={retryLoadableOrders}
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
