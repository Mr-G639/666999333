import { referralOrdersState } from "@/state";
import { useAtomValue } from "jotai";
import { Box, Header, Page } from "zmp-ui";
import ReferralOrderItem from "./referral-order-item";

const ReferralOrdersPage = () => {
  const referralOrders = useAtomValue(referralOrdersState);

  return (
    <Page className="flex flex-col bg-gray-100">
      <Header title="Đơn hàng giới thiệu" showBackIcon />
      <Box className="p-4 space-y-4 flex-1 overflow-y-auto">
        {referralOrders.map(order => (
          <ReferralOrderItem key={order.id} order={order} />
        ))}
      </Box>
    </Page>
  );
};

export default ReferralOrdersPage;