// src/pages/profile/index.tsx

import { useNavigate } from "react-router-dom";
import { Button } from "zmp-ui";

import ProfileActions from "./actions";
import DailyCheckIn from "./daily-check-in";
import FollowOA from "./follow-oa";
import Points from "./points";
import UserInfo from "./user-info";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-background p-4 space-y-2.5">
      <UserInfo>
        <Points />
      </UserInfo>
      <Button
        variant="secondary"
        fullWidth
        onClick={() => navigate("/profile/redeem")}
      >
        Đổi voucher
      </Button>
      <DailyCheckIn />
      <ProfileActions />
      <FollowOA />
    </div>
  );
};

export default ProfilePage;