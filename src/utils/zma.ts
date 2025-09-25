// src/utils/zma.ts

import { openPhone } from "zmp-sdk/apis";

/**
 * Lấy đường dẫn cơ sở (base path) của ứng dụng.
 * Hữu ích cho việc điều hướng và tải tài nguyên trong môi trường Zalo Mini App.
 */
export function getBasePath() {
  const urlParams = new URLSearchParams(window.location.search);
  const appEnv = urlParams.get("env");

  // Trong môi trường production hoặc các môi trường test được định nghĩa,
  // base path sẽ có dạng /zapps/APP_ID.
  if (
    import.meta.env.PROD ||
    appEnv === "TESTING_LOCAL" ||
    appEnv === "TESTING" ||
    appEnv === "DEVELOPMENT"
  ) {
    return `/zapps/${window.APP_ID}`;
  }

  // Mặc định, trả về base path được định nghĩa trong window object hoặc chuỗi rỗng.
  return window.BASE_PATH || "";
}


/**
 * Mở giao diện gọi điện thoại của hệ thống một cách an toàn.
 * Đã được tăng cường kiểm tra đầu vào để phòng ngừa lỗi.
 * @param phoneNumber Số điện thoại cần gọi.
 */
export const callPhoneNumber = async (phoneNumber: string) => {
  try {
    // [SỬA LỖI] Bổ sung kiểm tra kiểu dữ liệu của phoneNumber.
    // Logic cũ chỉ kiểm tra `phoneNumber` có `falsy` hay không (ví dụ: rỗng, null).
    // Nếu một giá trị không phải chuỗi (ví dụ: số `0`, boolean `false`) được truyền vào,
    // hàm sẽ không hoạt động đúng và có thể gây ra lỗi ở Zalo API.
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      console.warn("`callPhoneNumber` được gọi với số điện thoại không hợp lệ:", phoneNumber);
      return; // Dừng thực thi nếu không hợp lệ
    }

    // Gọi API của ZMP SDK để mở trình gọi điện
    await openPhone({ phoneNumber });

  } catch (error) {
    // Ghi lại lỗi để dễ dàng gỡ rối nếu có sự cố xảy ra
    console.error("Lỗi khi thực hiện cuộc gọi qua ZMA:", error);
  }
};