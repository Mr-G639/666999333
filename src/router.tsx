// src/router.tsx

import React, { Suspense, lazy } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, Params } from "react-router-dom";

// Utils & Layout
import Layout from "@/components/layout";
import { getBasePath } from "@/utils/zma";
import { Category } from "./types";
import { Box, Spinner } from "zmp-ui";

// Helper Component để hiển thị trạng thái loading khi tải trang
const PageFallback: React.FC = () => (
  <Box flex justifyContent="center" alignItems="center" className="h-screen">
    <Spinner visible />
  </Box>
);

// [TỐI ƯU] Bọc các component trong Suspense để lazy loading hoạt động
const lazyLoad = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<PageFallback />}>
    <Component />
  </Suspense>
);

// Pages - Đã được lazy load
const HomePage = lazy(() => import("@/pages/home"));
const CartPage = lazy(() => import("@/pages/cart"));
const CategoryDetailPage = lazy(() => import("@/pages/catalog/category-detail"));
const CategoryListPage = lazy(() => import("@/pages/catalog/category-list"));
const ProductDetailPage = lazy(() => import("@/pages/catalog/product-detail"));
const ProfilePage = lazy(() => import("@/pages/profile"));
const OrdersPage = lazy(() => import("./pages/orders"));
const ShippingAddressPage = lazy(() => import("./pages/cart/shipping-address"));
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
const SearchPage = lazy(() => import("@/pages/search"));
const DeliveryPage = lazy(() => import("./pages/cart/delivery"));
const AffiliatePage = lazy(() =>
  import("./pages/profile/affiliate").then((m) => ({
    default: (m as any).default ?? (m as any).Affiliate ?? (m as any).AffiliatePage,
  }))
);

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* === CÁC TRANG CÓ HIỂN THỊ HEADER === */}
      <Route index element={lazyLoad(HomePage)} handle={{ search: true, noBack: true }} />
      <Route path="/product/:id" element={lazyLoad(ProductDetailPage)} handle={{ search: true, noFloatingCart: true }} />
      <Route path="/cart" element={lazyLoad(CartPage)} handle={{ search: true, noFloatingCart: true, backTo: "/" }} />
      <Route path="/flash-sale" element={lazyLoad(FlashSalePage)} handle={{ search: true, backTo: "/" }} />

      {/* === CÁC TRANG BỊ ẨN HEADER === */}
      <Route path="/cart/delivery" element={lazyLoad(DeliveryPage)} handle={{ noHeader: true }} />
      <Route path="/categories" element={lazyLoad(CategoryListPage)} handle={{ noHeader: true }} />
      <Route path="/category/:id" element={lazyLoad(CategoryDetailPage)} handle={{ noHeader: true, title: ({ categories, params }: { categories: Category[], params: Params<string> }) => categories.find((c) => String(c.id) === params.id)?.name } } />
      <Route path="/product/:id/reviews" element={lazyLoad(ReviewsListPage)} handle={{ noHeader: true }} />
      <Route path="/search" element={lazyLoad(SearchPage)} handle={{ noHeader: true }} />
      <Route path="/orders/:status?" element={lazyLoad(OrdersPage)} handle={{ noHeader: true }} />
      <Route path="/order/:id" element={lazyLoad(OrderDetailPage)} handle={{ noHeader: true }} />
      <Route path="/vouchers" element={lazyLoad(VoucherSelectionPage)} handle={{ noHeader: true }} />
      <Route path="/shipping-address" element={lazyLoad(ShippingAddressPage)} handle={{ noHeader:true }} />
      <Route path="/profile" element={lazyLoad(ProfilePage)} handle={{ noHeader: true }} />
      <Route path="/profile/edit" element={lazyLoad(ProfileEditorPage)} handle={{ noHeader: true }} />
      <Route path="/profile/wishlist" element={lazyLoad(WishlistPage)} handle={{ noHeader: true }} />
      <Route path="/profile/vouchers" element={lazyLoad(VouchersPage)} handle={{ noHeader: true }} />
      <Route path="/profile/redeem" element={lazyLoad(RedeemPage)} handle={{ noHeader: true }} />
      <Route path="/profile/affiliate" element={lazyLoad(AffiliatePage)} handle={{ noHeader: true }} />
      <Route path="/profile/transaction/:id" element={lazyLoad(WithdrawalDetailPage)} handle={{ noHeader: true }} />
      <Route path="/profile/bank-info" element={lazyLoad(BankInfoPage)} handle={{ noHeader: true }} />
      <Route path="/profile/withdrawal" element={lazyLoad(WithdrawalPage)} handle={{ noHeader: true }} />
      <Route path="/login" element={lazyLoad(LoginPage)} handle={{ noHeader: true }} />
      <Route path="/register" element={lazyLoad(RegisterPage)} handle={{ noHeader: true }} />
    </Route>
  ),
  { basename: getBasePath() }
);

export default router;