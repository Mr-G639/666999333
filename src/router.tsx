// src/router.tsx

import { createBrowserRouter, Params } from "react-router-dom";
import { lazy } from "react";

// Utils & Layout
import Layout from "@/components/layout";
import { getBasePath } from "@/utils/zma";
import { Category } from "./types";

// Tối ưu hiệu năng: Sử dụng React.lazy để tải các trang khi cần thiết (code-splitting).
const HomePage = lazy(() => import("@/pages/home"));
const CartPage = lazy(() => import("@/pages/cart"));
const CategoryDetailPage = lazy(() => import("@/pages/catalog/category-detail"));
const CategoryListPage = lazy(() => import("@/pages/catalog/category-list"));
const ProductDetailPage = lazy(() => import("@/pages/catalog/product-detail"));
const ProfilePage = lazy(() => import("@/pages/profile"));
const SearchPage = lazy(() => import("@/pages/search"));
const OrdersPage = lazy(() => import("./pages/orders"));
const ShippingAddressPage = lazy(() => import("./pages/cart/shipping-address"));
const StationsPage = lazy(() => import("./pages/cart/stations"));
const OrderDetailPage = lazy(() => import("./pages/orders/detail"));
const ProfileEditorPage = lazy(() => import("./pages/profile/editor"));
const VouchersPage = lazy(() => import("./pages/profile/vouchers"));
const RedeemPage = lazy(() => import("./pages/profile/redeem"));
const BankInfoPage = lazy(() => import("./pages/profile/bank-info"));
const WithdrawalPage = lazy(() => import("./pages/profile/withdrawal"));
const WithdrawalDetailPage = lazy(() => import("./pages/profile/withdrawal-detail"));
const LoginPage = lazy(() => import("./pages/auth/login"));
const RegisterPage = lazy(() => import("./pages/auth/register"));
const VoucherSelectionPage = lazy(() => import("./pages/cart/voucher-selection"));
const WishlistPage = lazy(() => import("./pages/profile/wishlist"));
const ReviewsListPage = lazy(() => import("./pages/catalog/product-reviews/ReviewsListPage"));
const FlashSalePage = lazy(() => import("@/pages/flash-sale"));

// --- THAY ĐỔI TẠI ĐÂY ---
// Cập nhật đường dẫn import cho trang Affiliate
// Ensure the imported module conforms to React.lazy's expected shape { default: Component }
const AffiliatePage = lazy(() =>
  import("./pages/profile/affiliate").then((m) => ({
    // support modules that export default or a named export like Affiliate or AffiliatePage
    default: (m as any).default ?? (m as any).Affiliate ?? (m as any).AffiliatePage,
  }))
);

// Refactor: Nhóm các route lại với nhau để dễ quản lý.
const mainRoutes = [
  { path: "/", element: <HomePage />, handle: { logo: true, search: true } },
  { path: "/search", element: <SearchPage />, handle: { search: true, title: "Tìm kiếm", noFooter: true } },
  { path: "/categories", element: <CategoryListPage />, handle: { title: "Danh mục", noBack: true } },
  { path: "/category/:id", element: <CategoryDetailPage />, handle: { search: true, title: ({ categories, params }: { categories: Category[], params: Params<string> }) => categories.find((c) => String(c.id) === params.id)?.name } },
  { path: "/product/:id", element: <ProductDetailPage />, handle: { scrollRestoration: 0, noFloatingCart: true, backTo: "/" } },
  { path: "/product/:id/reviews", element: <ReviewsListPage />, handle: { title: "Tất cả đánh giá", noFooter: true, noFloatingCart: true } },
  { path: "/flash-sale", element: <FlashSalePage />, handle: { title: "Flash Sale", noBack: true, search: true } },
];

const orderRoutes = [
  { path: "/orders/:status?", element: <OrdersPage />, handle: { title: "Đơn hàng", noBack: true } },
  { path: "/order/:id", element: <OrderDetailPage />, handle: { title: "Thông tin đơn hàng" } },
];

const cartRoutes = [
  { path: "/cart", element: <CartPage />, handle: { title: "Giỏ hàng", noBack: true, noFloatingCart: true } },
  { path: "/vouchers", element: <VoucherSelectionPage />, handle: { title: "Chọn voucher", noFooter: true } },
  { path: "/shipping-address", element: <ShippingAddressPage />, handle: { title: "Địa chỉ nhận hàng", noFooter: true, noFloatingCart: true } },
  { path: "/stations", element: <StationsPage />, handle: { title: "Điểm nhận hàng", noFooter: true } },
];

const profileRoutes = [
  { path: "/profile", element: <ProfilePage />, handle: { logo: true, noBack: true } },
  { path: "/profile/edit", element: <ProfileEditorPage />, handle: { title: "Thông tin tài khoản", noFooter: true, noFloatingCart: true } },
  { path: "/profile/wishlist", element: <WishlistPage />, handle: { title: "Sản phẩm yêu thích", noFooter: true, noFloatingCart: true } },
  { path: "/profile/vouchers", element: <VouchersPage />, handle: { title: "Ví Voucher", noFooter: true, noFloatingCart: true } },
  { path: "/profile/redeem", element: <RedeemPage />, handle: { noFooter: true, noFloatingCart: true } },
  { 
    path: "/profile/affiliate", 
    element: <AffiliatePage />, 
    handle: { 
      title: "AFF 1 Click", 
      noFooter: true, 
      noFloatingCart: true 
    } 
  },
  // Các route liên quan đến rút tiền vẫn được giữ lại để sử dụng trong trang AFF 1 Click
  { path: "/profile/transaction/:id", element: <WithdrawalDetailPage />, handle: { noFooter: true, noFloatingCart: true } },
  { path: "/profile/bank-info", element: <BankInfoPage />, handle: { noFooter: true, noFloatingCart: true } },
  { path: "/profile/withdrawal", element: <WithdrawalPage />, handle: { noFooter: true, noFloatingCart: true } },
];

const authRoutes = [
  { path: "/login", element: <LoginPage />, handle: { title: "Đăng nhập", noFooter: true, noFloatingCart: true } },
  { path: "/register", element: <RegisterPage />, handle: { title: "Đăng ký", noFooter: true, noFloatingCart: true } },
];

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        ...mainRoutes,
        ...orderRoutes,
        ...cartRoutes,
        ...profileRoutes,
        ...authRoutes,
      ],
    },
  ],
  { basename: getBasePath() }
);

export default router;