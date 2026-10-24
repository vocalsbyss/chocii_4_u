const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedTraffic() {
  const existingVisitsCount = await prisma.pageVisit.count();
  if (existingVisitsCount > 20) {
    console.log(`Already have ${existingVisitsCount} traffic logs. Skipping seed.`);
    return;
  }

  console.log("Seeding realistic traffic logs for Chocii 4 U (Visakhapatnam)...");

  // Get all existing orders to link order conversions
  const orders = await prisma.order.findMany({
    select: { orderNumber: true, createdAt: true, customerId: true, total: true },
    orderBy: { createdAt: "asc" }
  });

  const popularPaths = [
    "/",
    "/menu",
    "/menu/dream-cake",
    "/menu/molten-brownie-bowl",
    "/menu/choco-churros-dips",
    "/menu/fruizy-can-cake",
    "/about",
    "/contact",
    "/feedback",
    "/cart",
    "/checkout"
  ];

  const devices = ["mobile", "mobile", "mobile", "desktop", "tablet"];
  const browsers = ["Mobile Safari", "Chrome Mobile", "Chrome", "Safari", "WhatsApp In-App"];
  const referrers = [
    "Direct / Bookmark",
    "https://api.whatsapp.com/",
    "https://www.google.com/search?q=chocii+4+u+visakhapatnam",
    "https://instagram.com/chocii4u",
    "https://m.facebook.com/"
  ];

  const now = new Date();
  const visits = [];

  // 1. Generate visits for each customer who placed an order (Full conversion funnel)
  for (const order of orders) {
    const orderTime = new Date(order.createdAt);
    const visitorId = `v_cust_${Math.random().toString(36).substring(2, 9)}`;
    const dev = "mobile";
    const ref = referrers[Math.floor(Math.random() * referrers.length)];

    // Step 1: Landing
    visits.push({
      visitorId,
      path: "/",
      referrer: ref,
      device: dev,
      browser: "Mobile Safari",
      city: "Visakhapatnam",
      isCustomer: true,
      customerId: order.customerId,
      hasOrdered: false,
      createdAt: new Date(orderTime.getTime() - 15 * 60 * 1000), // 15 mins before
    });

    // Step 2: Menu / Product Detail
    visits.push({
      visitorId,
      path: "/menu/dream-cake",
      referrer: "/",
      device: dev,
      browser: "Mobile Safari",
      city: "Visakhapatnam",
      isCustomer: true,
      customerId: order.customerId,
      hasOrdered: false,
      createdAt: new Date(orderTime.getTime() - 10 * 60 * 1000),
    });

    // Step 3: Cart
    visits.push({
      visitorId,
      path: "/cart",
      referrer: "/menu/dream-cake",
      device: dev,
      browser: "Mobile Safari",
      city: "Visakhapatnam",
      isCustomer: true,
      customerId: order.customerId,
      hasOrdered: false,
      createdAt: new Date(orderTime.getTime() - 5 * 60 * 1000),
    });

    // Step 4: Checkout
    visits.push({
      visitorId,
      path: "/checkout",
      referrer: "/cart",
      device: dev,
      browser: "Mobile Safari",
      city: "Visakhapatnam",
      isCustomer: true,
      customerId: order.customerId,
      hasOrdered: false,
      createdAt: new Date(orderTime.getTime() - 2 * 60 * 1000),
    });

    // Step 5: Order Completed
    visits.push({
      visitorId,
      path: `/order-success/${order.orderNumber}`,
      referrer: "/checkout",
      device: dev,
      browser: "Mobile Safari",
      city: "Visakhapatnam",
      isCustomer: true,
      customerId: order.customerId,
      hasOrdered: true,
      orderNumber: order.orderNumber,
      createdAt: orderTime,
    });
  }

  // 2. Generate organic browsing visitors (some bounce, some view menu, some view feedback)
  const nonConvertingVisitorsCount = 280;
  for (let i = 0; i < nonConvertingVisitorsCount; i++) {
    // Distribute timestamps over the last 5 days
    const hoursAgo = Math.floor(Math.random() * (24 * 5));
    const visitTime = new Date(now.getTime() - hoursAgo * 3600 * 1000 - Math.random() * 3600 * 1000);
    const visitorId = `v_org_${Math.random().toString(36).substring(2, 9)}`;
    const dev = devices[Math.floor(Math.random() * devices.length)];
    const browser = browsers[Math.floor(Math.random() * browsers.length)];
    const ref = referrers[Math.floor(Math.random() * referrers.length)];

    // Number of pages this visitor views: 1 to 4
    const pageCount = Math.floor(Math.random() * 3) + 1;
    for (let p = 0; p < pageCount; p++) {
      const pagePath = popularPaths[Math.floor(Math.random() * (popularPaths.length - 2))]; // usually don't reach checkout
      visits.push({
        visitorId,
        path: pagePath,
        referrer: p === 0 ? ref : "/",
        device: dev,
        browser,
        city: "Visakhapatnam",
        isCustomer: Math.random() > 0.7,
        hasOrdered: false,
        createdAt: new Date(visitTime.getTime() + p * 45 * 1000),
      });
    }
  }

  // Insert in batch
  await prisma.pageVisit.createMany({
    data: visits,
  });

  const total = await prisma.pageVisit.count();
  console.log(`Successfully seeded ${visits.length} page visits. Total in DB: ${total}`);
}

seedTraffic()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
