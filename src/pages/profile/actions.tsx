// src/pages/profile/actions.tsx

import { useNavigate } from 'react-router-dom';
import { List, Icon } from 'zmp-ui';
import { ComponentProps } from 'react';

type IconType = ComponentProps<typeof Icon>['icon'];

type ProfileAction = {
  id: string;
  icon: IconType;
  title: string;
  path: string;
};

const actionConfig: ProfileAction[] = [
  {
    id: 'orders',
    icon: 'zi-note',
    title: 'Lịch sử đơn hàng',
    path: '/orders',
  },
  {
    id: 'wishlist',
    icon: 'zi-heart',
    title: 'Danh sách yêu thích',
    path: '/profile/wishlist',
  },
  {
    id: 'vouchers',
    icon: 'zi-ticket' as IconType, // SỬA LỖI: 'zi-wallet' -> 'zi-ticket'
    title: 'Ví voucher',
    path: '/profile/vouchers',
  },
  {
    id: 'points',
    icon: 'zi-star-solid',
    title: 'Điểm tích lũy',
    path: '/profile/points',
  },
  {
    id: 'affiliate',
    icon: 'zi-share-solid',
    title: 'Affiliate',
    path: '/profile/affiliate',
  },
  {
    id: 'addresses',
    icon: 'zi-location-solid',
    title: 'Sổ địa chỉ',
    path: '/profile/addresses',
  },
  {
    id: 'support',
    icon: 'zi-call-solid',
    title: 'Hỗ trợ',
    path: '/profile/support',
  },
  {
    id: 'settings',
    icon: 'zi-setting',
    title: 'Cài đặt',
    path: '/profile/settings',
  },
];

const ProfileActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl">
      <List>
        {actionConfig.map((action) => (
          <List.Item
            key={action.id}
            onClick={() => navigate(action.path)}
            title={action.title}
            prefix={<Icon icon={action.icon} />}
            suffix={<Icon icon="zi-chevron-right" />}
          />
        ))}
      </List>
    </div>
  );
};

export default ProfileActions;