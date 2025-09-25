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
  Review,
  CartItem,
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
import mockReviews from "./mock/reviews.json";
import { getFinalPrice } from "./utils/cart";

// ==================================================================
// HELPER: XỬ LÝ HÌNH ẢNH
// ==================================================================

const getImageUrlFromModule = (imageModule: { default: string } | string): string => {
  if (typeof imageModule === 'string') {
    return imageModule;
  }
  return imageModule.default;
};

// ==================================================================
// SECTION: USER INFORMATION
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
      const phone = authSetting["scope.userPhonenumber"] || isDev ? await get(phoneState) : "";
      
      const fullUserInfo: UserInfo = {
        id: userInfo.id,
        name: userInfo.name,
        avatar: userInfo.avatar,
        phone,
        email: "",
        address: "",
      };
      localStorage.setItem(CONFIG.STORAGE_KEYS.USER_INFO, JSON.stringify(fullUserInfo));
      return fullUserInfo;
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
      toast.success("Giả lập lấy SĐT thành công: 0912345678");
      phone = "0912345678";
    }
  } catch (error) {
    console.warn("Lấy SĐT thất bại hoặc người dùng từ chối:", error);
  }
  return phone;
});

// ==================================================================
// SECTION: GENERAL STORE DATA
// ==================================================================

export const bannersState = atom(() => requestWithFallback<string[]>("/banners", []));

export const categoriesState = atom<Promise<Category[]>>(async () => {
  return mockCategoriesData;
});

export const categoriesStateUpwrapped = unwrap(categoriesState, (prev) => prev ?? []);

// ==================================================================
// SECTION: PRODUCTS
// ==================================================================

export const productsState = atom(async (get) => {
  const categories = await get(categoriesState);
  // Thêm kiểu cho product để TypeScript hiểu rõ cấu trúc dữ liệu trả về từ API
  const products = await requestWithFallback<(Omit<Product, 'category'> & { categoryId: number; images: any[] })[]>("/products", []);

  // Map dữ liệu sản phẩm, thêm thông tin category và xử lý URL hình ảnh
  return products.map((product) => {
    const category = categories.find((cat) => cat.id === product.categoryId);
    return {
      ...product,
      category: category!, // Thêm '!' để khẳng định category luôn tồn tại
      images: product.images.map(img => getImageUrlFromModule(img)),
    } as Product; // Ép kiểu kết quả cuối cùng về Product
  });
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
    return products.filter((product) => String(product.category.id) === id);
  })
);

// ==================================================================
// SECTION: SEARCH
// ==================================================================

export const keywordState = atom("");

export const searchCategoriesResultState = atom(async (get) => {
  const keyword = get(keywordState);
  if (!keyword) return [];
  const categories = await get(categoriesState);
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
// SECTION: CART - REFACTORED
// ==================================================================

export type CartItemIdentifier = { productId: number; quantity: number };

export const cartState = atomWithStorage<CartItemIdentifier[]>("cart", []);

export const cartDetailsState = atom(async (get) => {
  const cartIdentifiers = get(cartState);
  const allProducts = await get(productsState);

  const cartDetails = cartIdentifiers.map(identifier => {
    const product = allProducts.find(p => p.id === identifier.productId);
    if (!product) {
      return null;
    }
    return {
      product,
      quantity: identifier.quantity,
    };
  }).filter((item): item is CartItem => item !== null);

  return cartDetails;
});

export interface CartTotal {
  totalItems: number;
  totalAmount: number;
  finalAmount: number;
}

export const selectedVoucherState = atom<Voucher | undefined>(undefined);

export const cartTotalState = atom<Promise<CartTotal>>(async (get) => {
  const items = await get(cartDetailsState);
  const selectedVoucher = get(selectedVoucherState);

  const totalAmount = items.reduce(
    (total, item) => total + getFinalPrice(item.product) * item.quantity,
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
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
    totalAmount,
    finalAmount: Math.max(0, finalAmount),
  };
});

// ==================================================================
// SECTION: DELIVERY & CHECKOUT
// ==================================================================

export const deliveryModeState = atomWithStorage<Delivery["type"]>(CONFIG.STORAGE_KEYS.DELIVERY, "shipping");
export const shippingAddressState = atomWithStorage<ShippingAddress | undefined>(CONFIG.STORAGE_KEYS.SHIPPING_ADDRESS, undefined);

export const stationsState = atom(async () => {
  let location: Location | undefined;
  try {
    const { token } = await getLocation(); // Không truyền thuộc tính không hợp lệ, xử lý từ chối trong catch
    if (token) {
      toast("Giả lập vị trí thành công!", { icon: "ℹ" });
      location = { lat: 10.773756, lng: 106.689247 }; // VNG Campus
    }
  } catch (error) {
    console.warn("Lấy vị trí thất bại:", error);
  }

  const stations = await requestWithFallback<Station[]>("/stations", []);
  
  return stations.map((station) => ({
    ...station,
    distance: location ? formatDistant(calculateDistance(location.lat, location.lng, station.location.lat, station.location.lng)) : undefined,
  }));
});

export const selectedStationIndexState = atom(0);

export const selectedStationState = atom(async (get) => {
  const index = get(selectedStationIndexState);
  const stations = await get(stationsState);
  return stations[index];
});

// ==================================================================
// SECTION: ORDERS
// ==================================================================

export const ordersState = atomFamily((status: OrderStatus) =>
  atomWithRefresh(async () => {
    const allMockOrders = await requestWithFallback<Order[]>("/orders", []);
    return allMockOrders.filter((order) => order.status === status);
  })
);

export const newOrdersState = atomWithStorage<Order[]>("new_orders", []);

// ==================================================================
// SECTION: VOUCHERS & POINTS
// ==================================================================

export const userVouchersState = atomWithStorage<Voucher[]>("user_vouchers", []);

export const redeemableVouchersState = atom(() =>
  requestWithFallback<{ id: number; pointsCost: number; voucher: Voucher }[]>("/redeemable-vouchers", [])
);

interface DailyCheckInState {
  lastCheckInDate: string | null;
  streak: number;
}
export const dailyCheckInState = atomWithStorage<DailyCheckInState>("daily_check_in", { lastCheckInDate: null, streak: 0 });
export const userPointsState = atomWithStorage<number>("user_points", 500);

// ==================================================================
// SECTION: REVIEWS
// ==================================================================

export const reviewsState = atomFamily((productId: number) =>
  atomWithRefresh(async () => {
    const allReviews = mockReviews as Review[];
    const productReviews = allReviews.filter(review => review.productId === productId);
    return productReviews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  })
);

export const postReviewAtom = atom(
  null,
  async (get, set, { productId, review }: { productId: number, review: Omit<Review, 'id' | 'author' | 'timestamp' | 'productId'> }) => {
    const userInfo = await get(userInfoState);
    if (!userInfo) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      return;
    }
    
    console.log("Đang gửi review:", { productId, ...review, author: userInfo.name });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set(reviewsState(productId));
    
    toast.success("Đăng đánh giá thành công!");
  }
);

// ==================================================================
// SECTION: WALLET & REFERRALS
// ==================================================================

export const transactionsState = atomWithStorage<Transaction[]>("user_transactions", mockTransactions as Transaction[]);

export const referralOrdersState = atom(() => requestWithFallback<ReferralOrder[]>("/referral-orders", []));

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
// SECTION: UI STATE
// ==================================================================

export const mainScrollState = atom(0);
export const searchOverlayVisibleState = atom(false);
export const cartPopupVisibleState = atom(false);
export const userBankInfoState = atomWithStorage<UserBankInfo | undefined>("user_bank_info", undefined);