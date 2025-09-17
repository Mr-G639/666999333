// src/pages/profile/actions.tsx

import {
  HeartIcon, // Thêm import này
  OrderHistoryIcon,
  PackageIcon,
  VoucherIcon,
} from "@/components/vectors";
import { useNavigate } from "react-router-dom";
import { Icon, List } from "zmp-ui";

export default function ProfileActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border-[0.5px] border-black/15">
      <List>
        <List.Item
          title="Đơn hàng của tôi"
          prefix={<Icon icon="zi-note" />}
          suffix={<Icon icon="zi-chevron-right" />}
          onClick={() => navigate("/orders")}
        />
        {/* Thêm mục mới dưới đây */}
        <List.Item
          title="Sản phẩm yêu thích"
          prefix={<HeartIcon className="w-5 h-5" />}
          suffix={<Icon icon="zi-chevron-right" />}
          onClick={() => navigate("/profile/wishlist")}
        />
        <List.Item
          title="Ví Voucher"
          prefix={<VoucherIcon />}
          suffix={<Icon icon="zi-chevron-right" />}
          onClick={() => navigate("/profile/vouchers")}
        />
        <List.Item
          title="Ví Hoa Hồng"
          prefix={<PackageIcon active />}
          suffix={<Icon icon="zi-chevron-right" />}
          onClick={() => navigate("/profile/wallet")}
        />
        <List.Item
          title="Đơn giới thiệu"
          prefix={<OrderHistoryIcon />}
          suffix={<Icon icon="zi-chevron-right" />}
          onClick={() => navigate("/profile/referrals")}
        />
      </List>
    </div>
  );
}