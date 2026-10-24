export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductAddon {
  id: string;
  productId: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice: number | null;
  imageUrl: string;
  categoryId: string;
  category?: Category;
  isAvailable: boolean;
  isFeatured: boolean;
  preparationInfo: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  addons?: ProductAddon[];
}

export interface CartItemOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  cartItemId: string; // unique key: productId + customization + sorted addon ids
  productId: string;
  name: string;
  slug: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  customization: "CLASSIC" | "BALANCED";
  selectedAddons: CartItemOption[];
  specialInstructions?: string;
  lineTotal: number;
}

export type OrderFulfillmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type OrderPaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItemSnapshot {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  unitPrice: number;
  quantity: number;
  customization: string;
  selectedAddons: string; // JSON string
  specialInstructions: string | null;
  lineTotal: number;
}

export interface OrderStatusHistoryItem {
  id: string;
  orderId: string;
  previousStatus: string;
  newStatus: string;
  changedBy: string;
  note: string | null;
  createdAt: string | Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingToken: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryAddress: string;
  landmark: string | null;
  specialInstructions: string | null;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: "RAZORPAY" | "CASH_ON_DELIVERY";
  paymentStatus: OrderPaymentStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  items?: OrderItemSnapshot[];
  statusHistory?: OrderStatusHistoryItem[];
}

export interface StoreSettings {
  brandName: string;
  brandTagline: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  minOrderValue: number;
  storeIsOpen: boolean;
  openingHours: string;
  contactPhone: string;
  instagramUrl: string;
}

export interface CustomerSession {
  userId: string;
  name: string;
  phone: string;
  email?: string;
  role: "CUSTOMER" | "ADMIN";
}

