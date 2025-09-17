// src/state.ts

import { atom } from "jotai";
import {
  atomFamily,
  atomWithRefresh,
  atomWithStorage,
  loadable,
  unwrap,
} from "jotai/utils";
import {
  Cart,
  Category,
  Delivery,
  Location,
  Order,
  OrderStatus,
  Product,
  ShippingAddress,
  Station,
  UserInfo,
  Voucher,
  Transaction,
  ReferralOrder,
  UserBankInfo,
  Review, // SỬA LỖI: Thêm import 'Review'
} from "@/types";
import { requestWithFallback } from "@/utils/request";
import {
  getLocation,
  getPhoneNumber,
  getSetting,
  getUserInfo,
} from "zmp-sdk/apis";
import toast from "react-hot-toast";
import { calculateDistance } from "./utils/location";
import { formatDistant } from "./utils/format";
import CONFIG from "./config";
import { categories as mockCategoriesData } from "./mock/categories";
import mockTransactions from "./mock/transactions.json";
import mockReviews from "./mock/reviews.json"; // SỬA LỖI: Thêm import dữ liệu review mẫu

// ==================================================================
// PHẦN XỬ LÝ HÌNH ẢNH DANH MỤC LOCAL
// ==================================================================

const categoryImages = import.meta.glob<{ default: string }>(
  "./static/category/*",
  { eager: true, as: "url" }
);

const mappedCategories = mockCategoriesData.map((category) => {
  const imageName = category.image;
  const imagePath = `./static/category/${imageName}`;
  return {
    ...category,
    image: categoryImages[imagePath] || "",
  };
});


// ==================================================================
// PHẦN THÔNG TIN NGƯỜI DÙNG
// ==================================================================

export const userInfoKeyState = atom(0);

export const userInfoState = atom<Promise<UserInfo | undefined>>(async (get) => {
  get(userInfoKeyState);
  const savedUserInfo = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_INFO);
  if (savedUserInfo) {
    return JSON.parse(savedUserInfo);
  }
  try {
    const { authSetting } = await getSetting({});
    const isDev = !window.ZJSBridge;

    if (authSetting["scope.userInfo"] || isDev) {
      const { userInfo } = await getUserInfo({});
      const phone =
        authSetting["scope.userPhonenumber"] || isDev
          ? await get(phoneState)
          : "";
      return {
        id: userInfo.id,
        name: userInfo.name,
        avatar: userInfo.avatar,
        phone,
        email: "",
        address: "",
      };
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
  }
  return undefined;
});

export const loadableUserInfoState = loadable(userInfoState);

export const phoneState = atom(async () => {
  let phone = "";
  try {
    const { token } = await getPhoneNumber({});
    if (token) {
        toast(
          "Đã lấy được token SĐT. Giả lập SĐT: 0912345678...",
          {
            icon: "ℹ",
            duration: 10000,
          }
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        phone = "0912345678";
    }
  } catch (error) {
    console.warn("Lấy SĐT thất bại hoặc người dùng từ chối:", error);
  }
  return phone;
});

// ==================================================================
// PHẦN DỮ LIỆU CHUNG CỦA CỬA HÀNG
// ==================================================================

export const bannersState = atom(() =>
  requestWithFallback<string[]>("/banners", [])
);

export const categoriesState = atom(() => {
  return mappedCategories;
});

export const categoriesStateUpwrapped = unwrap(
  categoriesState,
  (prev) => prev ?? []
);

// ==================================================================
// PHẦN SẢN PHẨM
// ==================================================================

export const productsState = atom(async (get) => {
  const categories = get(categoriesState);
  const products = await requestWithFallback<
    (Product & { categoryId: number })[]
  >("/products", []);
  return products.map((product) => ({
    ...product,
    category:
      categories.find((category) => category.id === product.categoryId) ?? {
        id: 0,
        name: "Unknown",
        image: "",
      },
  }));
});

export const favoriteProductsState = atomWithStorage<number[]>("favorites", []);

export const favoriteProductsDetailsState = atom(async (get) => {
  const favoriteIds = get(favoriteProductsState);
  const allProducts = await get(productsState);
  return allProducts.filter(p => favoriteIds.includes(p.id));
});

export const flashSaleProductsState = atom(async (get) => await get(productsState));
export const recommendedProductsState = atom(async (get) => await get(productsState));

export const productState = atomFamily((id: number) =>
  atom(async (get) => {
    const products = await get(productsState);
    return products.find((product) => product.id === id);
  })
);

export const productsByCategoryState = atomFamily((id: string) =>
  atom(async (get) => {
    const products = await get(productsState);
    return products.filter((product) => String(product.categoryId) === id);
  })
);

// ==================================================================
// PHẦN TÌM KIẾM
// ==================================================================

export const keywordState = atom("");

export const searchCategoriesResultState = atom(async (get) => {
  const keyword = get(keywordState);
  if (!keyword) return [];
  const categories = get(categoriesState);
  return categories.filter((category) =>
    category.name.toLowerCase().includes(keyword.toLowerCase())
  );
});

export const searchResultState = atom(async (get) => {
  const keyword = get(keywordState);
  if (!keyword) return [];
  const products = await get(productsState);
  return products.filter((product) =>
    product.name.toLowerCase().includes(keyword.toLowerCase())
  );
});

// ==================================================================
// PHẦN GIỎ HÀNG (CART)
// ==================================================================

export const cartState = atomWithStorage<Cart>("cart", []);

export const selectedVoucherState = atom<Voucher | undefined>(undefined);

export const cartTotalState = atom((get) => {
  const items = get(cartState);
  const selectedVoucher = get(selectedVoucherState);

  const totalAmount = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  let finalAmount = totalAmount;
  if (selectedVoucher) {
    if (selectedVoucher.type === "FIXED_AMOUNT") {
      finalAmount -= selectedVoucher.value;
    } else if (selectedVoucher.type === "PERCENT") {
      finalAmount -= totalAmount * (selectedVoucher.value / 100);
    }
  }

  return {
    totalItems: items.length,
    totalAmount,
    finalAmount: Math.max(0, finalAmount),
  };
});

// ==================================================================
// PHẦN GIAO HÀNG VÀ THANH TOÁN
// ==================================================================

export const deliveryModeState = atomWithStorage<Delivery["type"]>(
  CONFIG.STORAGE_KEYS.DELIVERY,
  "shipping"
);

export const shippingAddressState = atomWithStorage<
  ShippingAddress | undefined
>(CONFIG.STORAGE_KEYS.SHIPPING_ADDRESS, undefined);

export const stationsState = atom(async () => {
  let location: Location | undefined;
  try {
    const { token } = await getLocation({});
    if (token) {
        toast("Đã lấy token vị trí. Giả lập vị trí tại VNG Campus...", {
          icon: "ℹ",
          duration: 10000,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        location = { lat: 10.773756, lng: 106.689247 };
    }
  } catch (error) {
    console.warn("Lấy vị trí thất bại hoặc người dùng từ chối:", error);
  }

  const stations = await requestWithFallback<Station[]>("/stations", []);
  return stations.map((station) => ({
    ...station,
    distance: location
      ? formatDistant(
          calculateDistance(
            location.lat,
            location.lng,
            station.location.lat,
            station.location.lng
          )
        )
      : undefined,
  }));
});

export const selectedStationIndexState = atom(0);

export const selectedStationState = atom(async (get) => {
  const index = get(selectedStationIndexState);
  const stations = await get(stationsState);
  return stations[index];
});

// ==================================================================
// PHẦN ĐƠN HÀNG (ORDERS)
// ==================================================================

export const ordersState = atomFamily((status: OrderStatus) =>
  atomWithRefresh(async () => {
    const allMockOrders = await requestWithFallback<Order[]>("/orders", []);
    const typedOrders = allMockOrders.map(order => ({
      ...order,
      createdAt: new Date(order.createdAt),
      receivedAt: new Date(order.receivedAt),
    }))
    return typedOrders.filter((order) => order.status === status);
  })
);

// ==================================================================
// PHẦN VOUCHER
// ==================================================================

export const userVouchersState = atomWithStorage<Voucher[]>("user_vouchers", []);

export const redeemableVouchersState = atom(() =>
  requestWithFallback<{ id: number; pointsCost: number; voucher: Voucher }[]>(
    "/redeemable-vouchers",
    []
  )
);

// ==================================================================
// PHẦN VÍ HOA HỒNG VÀ GIAO DỊCH
// ==================================================================
export const transactionsState = atomWithStorage<Transaction[]>(
  "user_transactions",
  mockTransactions as Transaction[],
);

export const referralOrdersState = atom(() =>
  requestWithFallback<ReferralOrder[]>("/referral-orders", [])
);

export const walletState = atom((get) => {
  const transactions = get(transactionsState);
  let availableBalance = 0;
  let pendingBalance = 0;

  transactions.forEach(tx => {
    if (tx.status === 'COMPLETED') {
      availableBalance += tx.amount;
    } else if (tx.type === 'COMMISSION' && tx.status === 'PENDING') {
      pendingBalance += tx.amount;
    }
  });

  return { availableBalance, pendingBalance };
});

// ==================================================================
// PHẦN ĐIỂM DANH VÀ ĐIỂM THƯỞNG
// ==================================================================
interface DailyCheckInState {
  lastCheckInDate: string | null;
  streak: number;
}

export const dailyCheckInState = atomWithStorage<DailyCheckInState>(
  "daily_check_in",
  {
    lastCheckInDate: null,
    streak: 0,
  }
);

export const userPointsState = atomWithStorage<number>("user_points", 500);

// ==================================================================
// PHẦN ĐÁNH GIÁ SẢN PHẨM
// ==================================================================
export const reviewsState = atomFamily((productId: number) =>
  atom(async () => {
    // Trong thực tế, bạn sẽ gọi API để lấy review theo productId
    // Ví dụ: await requestWithFallback<Review[]>(`/products/${productId}/reviews`, [])
    // Ở đây chúng ta chỉ giả lập
    return mockReviews.filter(review => review.productId === productId) as Review[];
  })
);

// ==================================================================
// PHẦN THÔNG TIN NGÂN HÀNG
// ==================================================================
export const userBankInfoState = atomWithStorage<UserBankInfo | undefined>(
  "user_bank_info",
  undefined
);
