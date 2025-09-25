// src/pages/orders/order-list.tsx

import { FC, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "@/api/orders";
import { Order, OrderStatus, Product, PaginatedResponse } from "@/types";
import { Box } from "zmp-ui";
import OrderSummary from "./order-summary"; // SỬA LỖI: Sử dụng component OrderSummary
import { useAtomValue } from "jotai";
import { newOrdersState } from "@/state";
import { EmptyOrder } from "@/components/empty";
import ReviewModal from "./review-modal";

interface OrderListProps {
  status: OrderStatus;
}

const OrderList: FC<OrderListProps> = ({ status }) => {
  const { data: originalOrders = [] } = useQuery<PaginatedResponse<Order>, Error, Order[]>({
    queryKey: ["orders"],
    queryFn: () => getAllOrders(),
    select: (data) => data.data,
  });

  const newOrders = useAtomValue(newOrdersState);

  const combinedAndFilteredOrders = useMemo(() => {
    const allOrders = [...newOrders.slice().reverse(), ...originalOrders];
    const uniqueOrders = [...new Map(allOrders.map(order => [order.id, order])).values()];
    
    return uniqueOrders.filter(
      (order) => order.status.toUpperCase() === status.toUpperCase()
    );
  }, [newOrders, originalOrders, status]);

  const [reviewingProduct, setReviewingProduct] = useState<Product | null>(null);

  if (combinedAndFilteredOrders.length === 0) {
    return <EmptyOrder />;
  }

  return (
    <>
      <Box className="p-4 space-y-4">
        {combinedAndFilteredOrders.map((order) => (
          // SỬA LỖI: Sử dụng OrderSummary và truyền đúng props
          <OrderSummary
            key={order.id}
            order={order}
            isCompleted={order.status === 'completed'}
            onReview={setReviewingProduct}
          />
        ))}
      </Box>
      <ReviewModal 
        product={reviewingProduct} 
        onClose={() => setReviewingProduct(null)} 
      />
    </>
  );
};

export default OrderList;