// src/router.tsx

import Layout from "@/components/layout";
import CartPage from "@/pages/cart";
import CategoryDetailPage from "@/pages/catalog/category-detail";
import CategoryListPage from "@/pages/catalog/category-list";
import ProductDetailPage from "@/pages/catalog/product-detail";
import HomePage from "@/pages/home";
import ProfilePage from "@/pages/profile";
import SearchPage from "@/pages/search";
import { createBrowserRouter } from "react-router-dom";
import { getBasePath } from "@/utils/zma";
import OrdersPage from "./pages/orders";
import ShippingAddressPage from "./pages/cart/shipping-address";
import StationsPage from "./pages/cart/stations";
import OrderDetailPage from "./pages/orders/detail";
import ProfileEditorPage from "./pages/profile/editor";
import VouchersPage from "./pages/profile/vouchers";
import RedeemPage from "./pages/profile/redeem";
import WalletPage from "./pages/profile/wallet";
import ReferralOrdersPage from "./pages/profile/referrals";
import ReferralDetailPage from "./pages/profile/referral-detail";
import BankInfoPage from "./pages/profile/bank-info";
import WithdrawalPage from "./pages/profile/withdrawal";
import WithdrawalDetailPage from "./pages/profile/withdrawal-detail";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import VoucherSelectionPage from "./pages/cart/voucher-selection";
import WishlistPage from "./pages/profile/wishlist";
// --- SỬA LỖI TẠI ĐÂY ---
import ReviewsListPage from "./pages/catalog/product-reviews/ReviewsListPage"; 

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
          handle: {
            logo: true,
            search: true,
          },
        },
        {
          path: "/login",
          element: <LoginPage />,
          handle: {
            title: "Đăng nhập",
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/register",
          element: <RegisterPage />,
          handle: {
            title: "Đăng ký",
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/categories",
          element: <CategoryListPage />,
          handle: {
            title: "Danh mục",
            noBack: true,
          },
        },
        {
          path: "/orders/:status?",
          element: <OrdersPage />,
          handle: {
            title: "Đơn hàng",
          },
        },
        {
          path: "/order/:id",
          element: <OrderDetailPage />,
          handle: {
            title: "Thông tin đơn hàng",
          },
        },
        {
          path: "/cart",
          element: <CartPage />,
          handle: {
            title: "Giỏ hàng",
            noBack: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/vouchers",
          element: <VoucherSelectionPage />,
          handle: {
            title: "Chọn voucher",
            noFooter: true,
          },
        },
        {
          path: "/shipping-address",
          element: <ShippingAddressPage />,
          handle: {
            title: "Địa chỉ nhận hàng",
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/stations",
          element: <StationsPage />,
          handle: {
            title: "Điểm nhận hàng",
            noFooter: true,
          },
        },
        {
          path: "/profile",
          element: <ProfilePage />,
          handle: {
            logo: true,
          },
        },
        {
          path: "/profile/edit",
          element: <ProfileEditorPage />,
          handle: {
            title: "Thông tin tài khoản",
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/profile/wishlist",
          element: <WishlistPage />,
          handle: {
            title: "Sản phẩm yêu thích",
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/profile/vouchers",
          element: <VouchersPage />,
          handle: {
            title: "Ví Voucher",
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/profile/redeem",
          element: <RedeemPage />,
          handle: {
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/profile/wallet",
          element: <WalletPage />,
          handle: {
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/profile/referrals",
          element: <ReferralOrdersPage />,
          handle: {
            title: "Đơn hàng giới thiệu",
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/profile/referrals/:id",
          element: <ReferralDetailPage />,
          handle: {
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/profile/transaction/:id",
          element: <WithdrawalDetailPage />,
          handle: {
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/profile/bank-info",
          element: <BankInfoPage />,
          handle: {
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/profile/withdrawal",
          element: <WithdrawalPage />,
          handle: {
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/category/:id",
          element: <CategoryDetailPage />,
          handle: {
            search: true,
            title: ({ categories, params }) =>
              categories.find((c) => String(c.id) === params.id)?.name,
          },
        },
        {
          path: "/product/:id",
          element: <ProductDetailPage />,
          handle: {
            scrollRestoration: 0,
            noFloatingCart: true,
          },
        },
        {
          path: "/product/:id/reviews",
          element: <ReviewsListPage />,
          handle: {
            title: "Tất cả đánh giá",
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/search",
          element: <SearchPage />,
          handle: {
            search: true,
            title: "Tìm kiếm",
            noFooter: true,
          },
        },
      ],
    },
  ],
  { basename: getBasePath() }
);

export default router;