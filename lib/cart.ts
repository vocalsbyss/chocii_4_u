"use client";

import { CartItem, CartItemOption } from "@/types";

const CART_STORAGE_KEY = "chocii_4_u_cart_v1";

export function generateCartItemId(
  productId: string,
  customization: "CLASSIC" | "BALANCED",
  selectedAddons: CartItemOption[]
): string {
  const addonIds = selectedAddons
    .map((a) => a.id)
    .sort()
    .join("-");
  return `${productId}_${customization}_${addonIds}`;
}

export function calculateItemLineTotal(
  basePrice: number,
  quantity: number,
  addons: CartItemOption[]
): number {
  const addonTotal = addons.reduce((sum, item) => sum + item.price, 0);
  return (basePrice + addonTotal) * quantity;
}

export function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to parse cart from localStorage", e);
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Trigger custom window event for instant real-time sync across components
    window.dispatchEvent(new Event("cravings_cart_updated"));
  } catch (e) {
    console.error("Failed to save cart to localStorage", e);
  }
}

export function addToCart(
  item: Omit<CartItem, "cartItemId" | "lineTotal">
): CartItem[] {
  const currentCart = getStoredCart();
  const cartItemId = generateCartItemId(
    item.productId,
    item.customization,
    item.selectedAddons
  );

  const existingIndex = currentCart.findIndex(
    (c) => c.cartItemId === cartItemId
  );

  if (existingIndex > -1) {
    const existing = currentCart[existingIndex];
    const newQty = existing.quantity + item.quantity;
    currentCart[existingIndex] = {
      ...existing,
      quantity: newQty,
      lineTotal: calculateItemLineTotal(
        existing.unitPrice,
        newQty,
        existing.selectedAddons
      ),
      specialInstructions: item.specialInstructions || existing.specialInstructions,
    };
  } else {
    currentCart.push({
      ...item,
      cartItemId,
      lineTotal: calculateItemLineTotal(
        item.unitPrice,
        item.quantity,
        item.selectedAddons
      ),
    });
  }

  saveStoredCart(currentCart);
  return currentCart;
}

export function updateCartQuantity(
  cartItemId: string,
  newQuantity: number
): CartItem[] {
  let cart = getStoredCart();
  if (newQuantity <= 0) {
    cart = cart.filter((item) => item.cartItemId !== cartItemId);
  } else {
    cart = cart.map((item) => {
      if (item.cartItemId === cartItemId) {
        return {
          ...item,
          quantity: newQuantity,
          lineTotal: calculateItemLineTotal(
            item.unitPrice,
            newQuantity,
            item.selectedAddons
          ),
        };
      }
      return item;
    });
  }
  saveStoredCart(cart);
  return cart;
}

export function removeFromCart(cartItemId: string): CartItem[] {
  const cart = getStoredCart().filter((item) => item.cartItemId !== cartItemId);
  saveStoredCart(cart);
  return cart;
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
  window.dispatchEvent(new Event("cravings_cart_updated"));
}

export function calculateCartSummary(
  cart: CartItem[],
  deliveryFeeSetting = 49,
  freeDeliveryThreshold = 599
) {
  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const deliveryFee =
    subtotal === 0 || subtotal >= freeDeliveryThreshold ? 0 : deliveryFeeSetting;
  const grandTotal = subtotal + deliveryFee;

  return {
    subtotal,
    deliveryFee,
    grandTotal,
    totalItemCount,
    isFreeDelivery: deliveryFee === 0 && subtotal > 0,
    amountNeededForFreeDelivery:
      subtotal < freeDeliveryThreshold ? freeDeliveryThreshold - subtotal : 0,
  };
}
