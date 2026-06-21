// ============================================================
// PRIMITIVE TYPES
// ============================================================

export type UserRole = 'admin' | 'user';
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered';
export type PaymentStatus = 'succeeded' | 'failed' | 'pending';

// ============================================================
// USER TYPES
// ============================================================

export interface UserAvatar {
  public_id: string;
  url: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: UserAvatar;
  createdAt: string;
}

// ============================================================
// PRODUCT TYPES
// ============================================================

export interface ProductImage {
  public_id: string;
  url: string;
}

export interface Review {
  _id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  ratings: number;
  images: ProductImage[];
  category: string;
  Stock: number;
  numOfReviews: number;
  reviews: Review[];
  createdAt?: string;
}

// ============================================================
// CART & SHIPPING TYPES
// ============================================================

export interface CartItem {
  product: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
}

export interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number | string;
  phoneNo: number | string;
}

// ============================================================
// ORDER TYPES
// ============================================================

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  product: string;
}

export interface PaymentInfo {
  id: string;
  status: PaymentStatus;
}

export interface PricingInfo {
  subtotal: number;
  shippingCharges: number;
  tax: number;
  totalPrice: number;
}

export interface Order {
  _id: string;
  shippingInfo: ShippingInfo;
  orderItems: OrderItem[];
  user: User | string;
  paymentInfo: PaymentInfo;
  pricingInfo: PricingInfo;
  orderStatus: OrderStatus;
  paidAt: string;
  deliveredAt?: string;
  createdAt: string;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedProductsResponse {
  success: boolean;
  products: Product[];
  productsCount: number;
  resultPerPage: number;
  filteredProductsCount: number;
}

export interface ProductResponse {
  success: boolean;
  product: Product;
}

export interface UserResponse {
  success: boolean;
  user: User;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
}

export interface OrderResponse {
  success: boolean;
  order: Order;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  totalAmount?: number;
}

export interface StripeKeyResponse {
  success: boolean;
  stripeApiKey: string;
}
