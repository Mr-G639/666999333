// src/pages/orders/index.tsx

import { Tabs } from "zmp-ui";
import OrderList from "./order-list";
import { ordersState } from "@/state";
import { useNavigate, useParams } from "react-router-dom";

function OrdersPage() {
  const { status } = useParams();
  const navigate = useNavigate();

  return (
    <Tabs
      className="h-full flex flex-col"
      activeKey={status}
      // THAY ĐỔI Ở ĐÂY: Thêm { replace: true } vào hàm navigate
      // Thao tác này sẽ thay thế trang hiện tại trong lịch sử duyệt web
      // thay vì thêm một trang mới.
      onChange={(status) => navigate(`/orders/${status}`, { replace: true })}
    >
      <Tabs.Tab key="pending" label="Đang xử lý">
        <OrderList ordersState={ordersState("pending")} />
      </Tabs.Tab>
      <Tabs.Tab key="shipping" label="Đang giao">
        <OrderList ordersState={ordersState("shipping")} />
      </Tabs.Tab>
      <Tabs.Tab key="completed" label="Lịch sử">
        <OrderList ordersState={ordersState("completed")} isCompleted />
      </Tabs.Tab>
    </Tabs>
  );
}

export default OrdersPage;