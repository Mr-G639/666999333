// src/pages/cart/delivery.tsx

import { FC, Suspense } from "react";
import { Box, Page } from "zmp-ui";
import DeliverySummary from "./delivery-summary";
import CartLoading from "@/components/skeleton";

const DeliveryPage: FC = () => {
  return (
    <Page className="flex flex-col bg-gray-100">
      {/* Header đã được quản lý bởi router, không cần ở đây */}
      <Box className="flex-1 overflow-y-auto">
        <Suspense fallback={<CartLoading />}>
          <DeliverySummary />
        </Suspense>
      </Box>
    </Page>
  );
};

export default DeliveryPage;