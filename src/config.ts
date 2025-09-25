// src/config.ts

/**
 * Đối tượng CONFIG chứa các hằng số và cấu hình tĩnh cho toàn bộ ứng dụng.
 * Việc tập trung các giá trị này vào một nơi giúp dễ dàng quản lý,
 * tránh lặp lại code và giảm thiểu lỗi do gõ sai (magic strings).
 */
const CONFIG = {
  /**
   * API Secret Key - KHÔNG ĐƯỢC HARDCODE TRỰC TIẾP TẠI ĐÂY.
   * Key này phải được load từ biến môi trường để đảm bảo an toàn.
   * Kẻ xấu có thể chiếm quyền truy cập hệ thống nếu key này bị lộ.
   *
   * Cách sử dụng:
   * 1. Tạo file `.env` ở thư mục gốc của dự án.
   * 2. Thêm dòng sau vào file `.env`:
   * `VITE_API_SECRET=your-super-secret-key-goes-here`
   * (Lưu ý: Với Vite, biến môi trường phía client phải bắt đầu bằng `VITE_`)
   */
  API_SECRET: import.meta.env.VITE_API_SECRET,

  /**
   * Định nghĩa các key (khóa) được sử dụng để lưu trữ dữ liệu trong Local Storage.
   * Sử dụng các hằng số này thay vì viết chuỗi trực tiếp sẽ giúp:
   * 1. IDE tự động gợi ý, tránh gõ sai.
   * 2. Dễ dàng thay đổi key đồng loạt ở một nơi duy nhất.
   */
  STORAGE_KEYS: {
    USER_INFO: "userInfo", // Key để lưu thông tin người dùng
    DELIVERY: "delivery", // Key để lưu phương thức vận chuyển đã chọn
    SHIPPING_ADDRESS: "shippingAddress", // Key để lưu địa chỉ giao hàng
  },
};

export default CONFIG;