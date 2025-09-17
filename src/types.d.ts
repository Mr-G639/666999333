export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  address: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: Category;
  detail?: string;
  soldCount?: number; // <-- Thêm dòng này
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Cart = CartItem[];

export interface Location {
  lat: number;
  lng: number;
}

export interface ShippingAddress {
  alias: string;
  address: string;
  name: string;
  phone: string;
}

export interface Station {
  id: number;
  name: string;
  image: string;
  address: string;
  location: Location;
}

export type Delivery =
  | ({
      type: "shipping";
    } & ShippingAddress)
  | {
      type: "pickup";
      name: string;
      address: string;
    };

export type OrderStatus = "pending" | "shipping" | "completed";
export type PaymentStatus = "pending" | "success" | "failed";

export interface Order {
  id: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  receivedAt: Date;
  items: CartItem[];
  delivery: Delivery;
  total: number;
  note: string;
}

export type VoucherType = "PERCENT" | "FIXED_AMOUNT" | "SHIPPING";

export interface Voucher {
  id: number;
  code: string;
  title: string;
  description: string;
  expiryDate: string;
  type: VoucherType;
  value: number;
  condition?: string;
}

export type TransactionType = "COMMISSION" | "WITHDRAWAL" | "ADJUSTMENT";
export type TransactionStatus = "PENDING" | "COMPLETED" | "REJECTED";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: string;
  description: string;
  referralId?: string;
}

export interface UserBankInfo {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
}

export interface ReferralOrder {
  id: string;
  orderId: string;
  totalAmount: number;
  commissionRate: number;
  commissionAmount: number;
  sharedLink: string;
  customerName: string;
  paymentStatus: PaymentStatus;
  commissionStatus: TransactionStatus
  date: string; // <-- Thêm lại dòng này
}