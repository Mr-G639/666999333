// src/pages/profile/daily-check-in.tsx

import { dailyCheckInState, userInfoState, userPointsState } from "@/state"; // Thêm userPointsState
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import toast from "react-hot-toast";
import { Button } from "zmp-ui";

const REWARD_POINTS = 10; // Số điểm thưởng mỗi lần điểm danh

const useDailyCheckIn = () => {
  const [checkInData, setCheckInData] = useAtom(dailyCheckInState);
  const setPoints = useSetAtom(userPointsState); // Lấy hàm để cập nhật điểm

  const today = new Date().toISOString().split("T")[0];

  const canCheckIn = checkInData.lastCheckInDate !== today;

  const handleCheckIn = () => {
    if (!canCheckIn) {
      toast.error("Hôm nay bạn đã điểm danh rồi!");
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split("T")[0];

    const isConsecutive = checkInData.lastCheckInDate === yesterdayString;
    const newStreak = isConsecutive ? checkInData.streak + 1 : 1;

    // Cập nhật trạng thái điểm danh
    setCheckInData({
      lastCheckInDate: today,
      streak: newStreak,
    });

    // Cộng điểm thưởng cho người dùng
    setPoints((currentPoints) => currentPoints + REWARD_POINTS);

    toast.success(
      `Điểm danh thành công! +${REWARD_POINTS} điểm. Chuỗi ${newStreak} ngày.`
    );
  };

  return {
    streak: checkInData.streak,
    canCheckIn,
    checkIn: handleCheckIn,
  };
};

export default function DailyCheckIn() {
  const userInfoLoadable = useAtomValue(userInfoState);
  const { streak, canCheckIn, checkIn } = useDailyCheckIn();

  if (!userInfoLoadable) {
    return null;
  }

  return (
    <div className="bg-section rounded-lg p-4 space-y-3 border-[0.5px] border-black/15">
      <div className="text-sm font-medium">Điểm danh hàng ngày</div>
      <div className="text-center text-gray-500 text-xs">
        Bạn đã điểm danh liên tục{" "}
        <span className="font-bold text-primary text-sm">{streak}</span> ngày!
      </div>
      <Button
        fullWidth
        disabled={!canCheckIn}
        onClick={checkIn}
        variant={canCheckIn ? "primary" : "secondary"}
      >
        {canCheckIn
          ? `Điểm danh nhận ${REWARD_POINTS} điểm!`
          : "Hẹn gặp lại bạn vào ngày mai"}
      </Button>
    </div>
  );
}