import { Product, Category } from "@/types";

export const FALLBACK_CATEGORIES: Category[] = [
  { id: "cat-signature-cakes", name: "Signature Cakes", slug: "signature-cakes", sortOrder: 1, isActive: true },
  { id: "cat-brownie-bowls", name: "Brownie Bowls", slug: "brownie-bowls", sortOrder: 2, isActive: true },
  { id: "cat-signature-classics", name: "Signature Classics", slug: "signature-classics", sortOrder: 3, isActive: true },
  { id: "cat-chilled-specialities", name: "Chilled Specialities", slug: "chilled-specialities", sortOrder: 4, isActive: true },
  { id: "cat-to-go-specials", name: "To-Go Specials", slug: "to-go-specials", sortOrder: 5, isActive: true },
];

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "prod-dream-cake",
    name: "Dream Cake",
    slug: "dream-cake",
    description: "Our signature dessert: A dark chocolate top layer over rich mud cake, fluffy chocolate mousse, and delicate cocoa soil.",
    basePrice: 349,
    salePrice: 329,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
    categoryId: "cat-signature-cakes",
    isAvailable: true,
    isFeatured: true,
    preparationInfo: "Served chilled to preserve texture and chocolate layers.",
    createdAt: "2026-10-24T00:00:00.000Z",
    updatedAt: "2026-10-24T00:00:00.000Z",
    category: FALLBACK_CATEGORIES[0],
    addons: [
      { id: "addon-dc-1", productId: "prod-dream-cake", name: "Toasted Hazelnut Crunch", price: 59, isAvailable: true },
      { id: "addon-dc-2", productId: "prod-dream-cake", name: "Fresh Berry Coulis", price: 49, isAvailable: true },
      { id: "addon-dc-3", productId: "prod-dream-cake", name: "Extra Cocoa Crumble", price: 39, isAvailable: true },
    ],
  },
  {
    id: "prod-dream-bowl",
    name: "Dream Bowl",
    slug: "dream-bowl",
    description: "A fudgy chocolate brownie dessert bowl topped with rich chocolate sauce, crunchy feuilletine flakes, and chocolate pearls.",
    basePrice: 299,
    salePrice: null,
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000&auto=format&fit=crop",
    categoryId: "cat-brownie-bowls",
    isAvailable: true,
    isFeatured: true,
    preparationInfo: "Warm brownie base served warm with chilled topping contrasts.",
    createdAt: "2026-10-24T00:00:00.000Z",
    updatedAt: "2026-10-24T00:00:00.000Z",
    category: FALLBACK_CATEGORIES[1],
    addons: [
      { id: "addon-db-1", productId: "prod-dream-bowl", name: "Vanilla Bean Ice Cream Scoop", price: 69, isAvailable: true },
      { id: "addon-db-2", productId: "prod-dream-bowl", name: "Roasted Hazelnuts", price: 49, isAvailable: true },
      { id: "addon-db-3", productId: "prod-dream-bowl", name: "Extra Chocolate Ganache", price: 59, isAvailable: true },
    ],
  },
  {
    id: "prod-delulu-bowl",
    name: "Delulu Bowl",
    slug: "delulu-bowl",
    description: "Decadent chocolate brownie dessert bowl layered with creamy hazelnut spread, dark ganache, and crispy chocolate pearls.",
    basePrice: 299,
    salePrice: null,
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000&auto=format&fit=crop",
    categoryId: "cat-brownie-bowls",
    isAvailable: true,
    isFeatured: true,
    preparationInfo: "Warm brownie base served warm with chilled topping contrasts.",
    createdAt: "2026-10-24T00:00:00.000Z",
    updatedAt: "2026-10-24T00:00:00.000Z",
    category: FALLBACK_CATEGORIES[1],
    addons: [
      { id: "addon-delulu-1", productId: "prod-delulu-bowl", name: "Vanilla Bean Ice Cream Scoop", price: 69, isAvailable: true },
      { id: "addon-delulu-2", productId: "prod-delulu-bowl", name: "Roasted Hazelnuts", price: 49, isAvailable: true },
      { id: "addon-delulu-3", productId: "prod-delulu-bowl", name: "Extra Chocolate Ganache", price: 59, isAvailable: true },
    ],
  },
  {
    id: "prod-choco-churros",
    name: "Choco Churros",
    slug: "choco-churros",
    description: "Crispy fluted churros dusted with cinnamon and sugar. Served with dark cocoa & white chocolate dipping sauces.",
    basePrice: 249,
    salePrice: null,
    imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1000&auto=format&fit=crop",
    categoryId: "cat-signature-classics",
    isAvailable: true,
    isFeatured: true,
    preparationInfo: "Best enjoyed warm with chocolate dipping sauces.",
    createdAt: "2026-10-24T00:00:00.000Z",
    updatedAt: "2026-10-24T00:00:00.000Z",
    category: FALLBACK_CATEGORIES[2],
    addons: [
      { id: "addon-cc-1", productId: "prod-choco-churros", name: "Extra White Chocolate Dip", price: 49, isAvailable: true },
      { id: "addon-cc-2", productId: "prod-choco-churros", name: "Warm Salted Caramel Dip", price: 49, isAvailable: true },
      { id: "addon-cc-3", productId: "prod-choco-churros", name: "Pistachio Praline Crumble", price: 39, isAvailable: true },
    ],
  },
  {
    id: "prod-fruizy",
    name: "Fruizy",
    slug: "fruizy",
    description: "Tanghulu-inspired candied fruit sticks: Strawberries & grapes coated in a crisp candied sugar glaze.",
    basePrice: 229,
    salePrice: null,
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
    categoryId: "cat-chilled-specialities",
    isAvailable: true,
    isFeatured: true,
    preparationInfo: "Served chilled to preserve the crisp candied glaze.",
    createdAt: "2026-10-24T00:00:00.000Z",
    updatedAt: "2026-10-24T00:00:00.000Z",
    category: FALLBACK_CATEGORIES[3],
    addons: [
      { id: "addon-fr-1", productId: "prod-fruizy", name: "Dark Chocolate Fondue Dip", price: 49, isAvailable: true },
      { id: "addon-fr-2", productId: "prod-fruizy", name: "Popping Candy Sprinkles", price: 29, isAvailable: true },
      { id: "addon-fr-3", productId: "prod-fruizy", name: "Chili Lime Sea Salt Dust", price: 29, isAvailable: true },
    ],
  },
  {
    id: "prod-can-cake",
    name: "Can Cake",
    slug: "can-cake",
    description: "Dessert in a pop-top can: Layered with chocolate chiffon, vanilla mascarpone cream, and rich ganache ribbons.",
    basePrice: 269,
    salePrice: null,
    imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1000&auto=format&fit=crop",
    categoryId: "cat-to-go-specials",
    isAvailable: true,
    isFeatured: true,
    preparationInfo: "Ready-to-eat pop-top can. Perfect for gifting and celebrations on the go.",
    createdAt: "2026-10-24T00:00:00.000Z",
    updatedAt: "2026-10-24T00:00:00.000Z",
    category: FALLBACK_CATEGORIES[4],
    addons: [
      { id: "addon-can-1", productId: "prod-can-cake", name: "Caramelized Hazelnut Crunch", price: 49, isAvailable: true },
      { id: "addon-can-2", productId: "prod-can-cake", name: "Espresso Pour-Over Shot", price: 49, isAvailable: true },
      { id: "addon-can-3", productId: "prod-can-cake", name: "Toasted Marshmallow Layer", price: 39, isAvailable: true },
    ],
  },
];

export function getFallbackProducts(): Product[] {
  return FALLBACK_PRODUCTS;
}

export function getFallbackCategories(): Category[] {
  return FALLBACK_CATEGORIES;
}

export function getFallbackProductBySlug(slug: string): Product | null {
  const product = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  return product || null;
}

export function getFallbackCategoryBySlug(
  slug: string
): (Category & { products: Product[] }) | null {
  const category = FALLBACK_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return null;
  const products = FALLBACK_PRODUCTS.filter((p) => p.categoryId === category.id);
  return { ...category, products };
}
