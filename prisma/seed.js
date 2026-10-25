const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding chocii 4 u database...");

  // 1. Seed Categories
  const categoriesData = [
    { name: "Signature Cakes", slug: "signature-cakes", sortOrder: 1 },
    { name: "Brownie Bowls", slug: "brownie-bowls", sortOrder: 2 },
    { name: "Signature Classics", slug: "signature-classics", sortOrder: 3 },
    { name: "Chilled Specialities", slug: "chilled-specialities", sortOrder: 4 },
    { name: "To-Go Specials", slug: "to-go-specials", sortOrder: 5 },
  ];

  const createdCategories = {};
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    createdCategories[cat.slug] = record.id;
  }

  // 2. Seed Products
  const productsData = [
    {
      name: "Dream Cake",
      slug: "dream-cake",
      description: "Our signature dessert: A dark chocolate top layer over rich mud cake, fluffy chocolate mousse, and delicate cocoa soil.",
      basePrice: 349,
      salePrice: 329,
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
      categoryId: createdCategories["signature-cakes"],
      isAvailable: true,
      isFeatured: true,
      preparationInfo: "Served chilled to preserve texture and chocolate layers.",
      addons: [
        { name: "Toasted Hazelnut Crunch", price: 59 },
        { name: "Fresh Berry Coulis", price: 49 },
        { name: "Extra Cocoa Crumble", price: 39 },
      ],
    },
    {
      name: "Dream Bowl",
      slug: "dream-bowl",
      description: "A fudgy chocolate brownie dessert bowl topped with rich chocolate sauce, crunchy feuilletine flakes, and chocolate pearls.",
      basePrice: 299,
      salePrice: null,
      imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000&auto=format&fit=crop",
      categoryId: createdCategories["brownie-bowls"],
      isAvailable: true,
      isFeatured: true,
      preparationInfo: "Warm brownie base served warm with chilled topping contrasts.",
      addons: [
        { name: "Vanilla Bean Ice Cream Scoop", price: 69 },
        { name: "Roasted Hazelnuts", price: 49 },
        { name: "Extra Chocolate Ganache", price: 59 },
      ],
    },
    {
      name: "Choco Churros",
      slug: "choco-churros",
      description: "Crispy fluted churros dusted with cinnamon and sugar. Served with dark cocoa & white chocolate dipping sauces.",
      basePrice: 249,
      salePrice: null,
      imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1000&auto=format&fit=crop",
      categoryId: createdCategories["signature-classics"],
      isAvailable: true,
      isFeatured: true,
      preparationInfo: "Best enjoyed warm with chocolate dipping sauces.",
      addons: [
        { name: "Extra White Chocolate Dip", price: 49 },
        { name: "Warm Salted Caramel Dip", price: 49 },
        { name: "Pistachio Praline Crumble", price: 39 },
      ],
    },
    {
      name: "Fruizy",
      slug: "fruizy",
      description: "Tanghulu-inspired candied fruit sticks: Strawberries & grapes coated in a crisp candied sugar glaze.",
      basePrice: 229,
      salePrice: null,
      imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
      categoryId: createdCategories["chilled-specialities"],
      isAvailable: true,
      isFeatured: true,
      preparationInfo: "Served chilled to preserve the crisp candied glaze.",
      addons: [
        { name: "Dark Chocolate Fondue Dip", price: 49 },
        { name: "Popping Candy Sprinkles", price: 29 },
        { name: "Chili Lime Sea Salt Dust", price: 29 },
      ],
    },
    {
      name: "Can Cake",
      slug: "can-cake",
      description: "Dessert in a pop-top can: Layered with chocolate chiffon, vanilla mascarpone cream, and rich ganache ribbons.",
      basePrice: 269,
      salePrice: null,
      imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1000&auto=format&fit=crop",
      categoryId: createdCategories["to-go-specials"],
      isAvailable: true,
      isFeatured: true,
      preparationInfo: "Ready-to-eat pop-top can. Perfect for gifting and celebrations on the go.",
      addons: [
        { name: "Caramelized Hazelnut Crunch", price: 49 },
        { name: "Espresso Pour-Over Shot", price: 49 },
        { name: "Toasted Marshmallow Layer", price: 39 },
      ],
    },
  ];

  for (const prod of productsData) {
    const { addons, ...prodDetails } = prod;
    const existing = await prisma.product.findUnique({
      where: { slug: prod.slug },
    });

    let productRecord;
    if (existing) {
      productRecord = await prisma.product.update({
        where: { slug: prod.slug },
        data: prodDetails,
      });
      // Delete existing addons and re-add
      await prisma.productAddon.deleteMany({
        where: { productId: productRecord.id },
      });
    } else {
      productRecord = await prisma.product.create({
        data: prodDetails,
      });
    }

    for (const addon of addons) {
      await prisma.productAddon.create({
        data: {
          productId: productRecord.id,
          name: addon.name,
          price: addon.price,
          isAvailable: true,
        },
      });
    }
  }

  // 3. Seed Default Store Settings
  const defaultSettings = [
    { key: "brandName", value: "chocii 4 u", description: "Brand Name" },
    { key: "brandTagline", value: "A Little Treat, Just for You.", description: "Brand Tagline" },
    { key: "deliveryFee", value: "49", description: "Flat delivery fee in INR" },
    { key: "freeDeliveryThreshold", value: "599", description: "Orders above this get free delivery" },
    { key: "minOrderValue", value: "199", description: "Minimum order value in INR" },
    { key: "storeIsOpen", value: "true", description: "Whether the store is currently accepting orders" },
    { key: "openingHours", value: "12:00 PM - 01:00 AM", description: "Operating hours" },
    { key: "contactPhone", value: "+91 86883 67177", description: "Customer support phone" },
    { key: "instagramUrl", value: "https://instagram.com/chocii4u.official", description: "Official Instagram" },
    { key: "homepage_style", value: "cooldock", description: "Homepage showcase style: classic or cooldock" },
  ];

  for (const setting of defaultSettings) {
    await prisma.storeSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: setting,
    });
  }

  // 4. Seed Default Admin User
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "CravingsAdmin@2026";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { phone: "+919999999999" },
    update: {
      name: "Head Chef & Admin",
      role: "ADMIN",
      password: hashedPassword,
    },
    create: {
      name: "Head Chef & Admin",
      phone: "+919999999999",
      role: "ADMIN",
      password: hashedPassword,
    },
  });

  console.log("chocii 4 u database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
