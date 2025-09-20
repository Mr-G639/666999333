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
const WalletPage = lazy(() => import("./pages/profile/wallet"));
const ReferralOrdersPage = lazy(() => import("./pages/profile/referrals"));
const ReferralDetailPage = lazy(() => import("./pages/profile/referral-detail"));
const BankInfoPage = lazy(() => import("./pages/profile/bank-info"));
const WithdrawalPage = lazy(() => import("./pages/profile/withdrawal"));
const WithdrawalDetailPage = lazy(() => import("./pages/profile/withdrawal-detail"));
const LoginPage = lazy(() => import("./pages/auth/login"));
const RegisterPage = lazy(() => import("./pages/auth/register"));
const VoucherSelectionPage = lazy(() => import("./pages/cart/voucher-selection"));
const WishlistPage = lazy(() => import("./pages/profile/wishlist"));
const ReviewsListPage = lazy(() => import("./pages/catalog/product-reviews/ReviewsListPage"));
const FlashSalePage = lazy(() => import("@/pages/flash-sale"));


// Refactor: Nhóm các route lại với nhau để dễ quản lý.
const mainRoutes = [
  { path: "/", element: <HomePage />, handle: { logo: true, search: true } },
  { path: "/search", element: <SearchPage />, handle: { search: true, title: "Tìm kiếm", noFooter: true } },
  // THAY ĐỔI: Thêm backTo để quay về trang chủ từ trang "Tất cả danh mục"
  { path: "/categories", element: <CategoryListPage />, handle: { title: "Danh mục", backTo: "/" } },
  { path: "/category/:id", element: <CategoryDetailPage />, handle: { search: true, title: ({ categories, params }: { categories: Category[], params: Params<string> }) => categories.find((c) => String(c.id) === params.id)?.name } },
  { path: "/product/:id", element: <ProductDetailPage />, handle: { scrollRestoration: 0, noFloatingCart: true } },
  { path: "/product/:id/reviews", element: <ReviewsListPage />, handle: { title: "Tất cả đánh giá", noFooter: true, noFloatingCart: true } },
  { path: "/flash-sale", element: <FlashSalePage />, handle: { title: "Flash Sale", search: true } },
];

const orderRoutes = [
  // THAY ĐỔI: Thêm backTo để quay về trang chủ
  { path: "/orders/:status?", element: <OrdersPage />, handle: { title: "Đơn hàng", backTo: "/" } },
  { path: "/order/:id", element: <OrderDetailPage />, handle: { title: "Thông tin đơn hàng" } },
];

const cartRoutes = [
  // THAY ĐỔI: Bỏ noBack và thêm backTo để quay về trang chủ
  { path: "/cart", element: <CartPage />, handle: { title: "Giỏ hàng", backTo: "/", noFloatingCart: true } },
  { path: "/vouchers", element: <VoucherSelectionPage />, handle: { title: "Chọn voucher", noFooter: true } },
  { path: "/shipping-address", element: <ShippingAddressPage />, handle: { title: "Địa chỉ nhận hàng", noFooter: true, noFloatingCart: true } },
  { path: "/stations", element: <StationsPage />, handle: { title: "Điểm nhận hàng", noFooter: true } },
];

const profileRoutes = [
  { path: "/profile", element: <ProfilePage />, handle: { logo: true } },
  { path: "/profile/edit", element: <ProfileEditorPage />, handle: { title: "Thông tin tài khoản", noFooter: true, noFloatingCart: true } },
  { path: "/profile/wishlist", element: <WishlistPage />, handle: { title: "Sản phẩm yêu thích", noFooter: true, noFloatingCart: true } },
  { path: "/profile/vouchers", element: <VouchersPage />, handle: { title: "Ví Voucher", noFooter: true, noFloatingCart: true } },
  { path: "/profile/redeem", element: <RedeemPage />, handle: { noFooter: true, noFloatingCart: true } },
  { 
    path: "/profile/wallet", 
    element: <WalletPage />, 
    handle: { 
      title: "Ví hoa hồng", 
      noFooter: true, 
      noFloatingCart: true 
    } 
  },
  { path: "/profile/referrals", element: <ReferralOrdersPage />, handle: { title: "Đơn hàng giới thiệu", noFooter: true, noFloatingCart: true } },
  { path: "/profile/referrals/:id", element: <ReferralDetailPage />, handle: { noFooter: true, noFloatingCart: true } },
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