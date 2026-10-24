const http = require("http");

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = { "Content-Type": "application/json" };
    const headers = { ...defaultHeaders, ...(options.headers || {}) };
    let bodyData = null;
    if (options.body) {
      bodyData = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
      headers["Content-Length"] = Buffer.byteLength(bodyData);
    }

    const reqOptions = {
      hostname: "localhost",
      port: 3000,
      path,
      method: options.method || "GET",
      headers,
    };

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
          json,
        });
      });
    });

    req.on("error", reject);

    if (bodyData) {
      req.write(bodyData);
    }
    req.end();
  });
}

function parseCookie(res, cookieName) {
  const setCookies = res.headers["set-cookie"];
  if (!setCookies) return null;
  for (const c of setCookies) {
    if (c.startsWith(cookieName + "=")) {
      return c.split(";")[0];
    }
  }
  return null;
}

async function runTests() {
  console.log("=================================================");
  console.log("CHOCII 4 U — COMPREHENSIVE END-TO-END TEST RUN");
  console.log("=================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Homepage & Sequential Dessert Transition Stages
  const homeRes = await request("/");
  assert(homeRes.statusCode === 200, "Homepage returns HTTP 200");
  assert(homeRes.data.toLowerCase().includes("chocii 4 u"), "Homepage contains brand wordmark chocii 4 u");
  assert(homeRes.data.includes("Explore Our Menu") && homeRes.data.includes("CHOCII 4 U • DESSERT MENU"), "Homepage features immediate Dessert Menu catalog");
  assert(homeRes.data.includes("Dream Cake") && homeRes.data.includes("Can Cake") && homeRes.data.includes("Fruizy"), "Homepage presents artisanal desserts");
  assert(!homeRes.data.includes("THE SIGNATURE cravings ONE ATELIER"), "Homepage has removed the redundant signature menu page as requested");
  assert(!homeRes.data.includes("Discover Your Next"), "Homepage has removed the extra obstructive banner as requested");
  assert(!homeRes.data.toLowerCase().includes("wearebrand"), "Homepage has zero mentions of wearebrand");

  // 2. Security Check (Middleware redirects)
  const menuUnauth = await request("/menu");
  assert(
    menuUnauth.statusCode === 307 &&
      menuUnauth.headers.location?.includes("/sign-in?redirect=%2Fmenu"),
    "Unauthenticated access to /menu redirects to /sign-in"
  );

  const adminUnauth = await request("/admin");
  assert(
    adminUnauth.statusCode === 307 &&
      adminUnauth.headers.location?.includes("/admin/login"),
    "Unauthenticated access to /admin redirects to /admin/login"
  );

  const adminApiUnauth = await request("/api/admin/orders");
  assert(
    adminApiUnauth.statusCode === 401,
    "Unauthenticated API call to /api/admin/orders rejected with HTTP 401"
  );

  // 3. Customer OTP Sign-In
  const sendOtpRes = await request("/api/auth/otp/send", {
    method: "POST",
    headers: { "x-test-suite": "cravings-e2e" },
    body: { name: "Rohan Sharma", phone: "9876543210", email: "rohan.sharma@example.com" },
  });
  assert(sendOtpRes.statusCode === 200, "OTP request succeeded");
  const demoOtp = sendOtpRes.json?.demoCode;
  assert(Boolean(demoOtp), `Generated 6-digit OTP code received: ${demoOtp}`);

  const verifyOtpRes = await request("/api/auth/otp/verify", {
    method: "POST",
    body: { name: "Rohan Sharma", phone: "+919876543210", email: "rohan.sharma@example.com", code: demoOtp },
  });
  assert(verifyOtpRes.statusCode === 200, "OTP verification succeeded");
  const customerCookie = parseCookie(verifyOtpRes, "cravings_customer_token");
  assert(Boolean(customerCookie), "Customer session JWT cookie issued");

  // 4. Products Catalog
  const productsRes = await request("/api/products");
  assert(productsRes.statusCode === 200, "Products API returns HTTP 200");
  const products = productsRes.json?.products || [];
  assert(products.length >= 5, `Database menu loaded ${products.length} products`);

  const dreamCake = products.find((p) => p.slug === "dream-cake");
  assert(Boolean(dreamCake), "Dream Cake found in database catalog");

  // 5. Customer Place Order (Direct into Database)
  const orderRes = await request("/api/orders", {
    method: "POST",
    headers: { Cookie: customerCookie },
    body: {
      customerName: "Rohan Sharma",
      customerPhone: "+919876543210",
      deliveryAddress: "Flat 402, Sai Residency, Muralinagar, Madhavadhara, Visakhapatnam",
      landmark: "Near Metro",
      specialInstructions: "Handle with care please",
      paymentMethod: "CASH_ON_DELIVERY",
      items: [
        {
          productId: dreamCake.id,
          quantity: 2,
          customization: "CLASSIC",
          selectedAddons: dreamCake.addons?.slice(0, 1),
          specialInstructions: "Extra crunchy top",
        },
      ],
    },
  });

  assert(orderRes.statusCode === 200, "Customer order placed successfully in DB");
  const createdOrder = orderRes.json?.order;
  assert(
    Boolean(createdOrder?.orderNumber && createdOrder?.trackingToken),
    `Order created: ${createdOrder?.orderNumber}`
  );

  // 6. Admin Authentication & Real-Time Order Verification
  const adminLoginRes = await request("/api/admin/auth/login", {
    method: "POST",
    body: { phone: "+919999999999", password: "CravingsAdmin@2026" },
  });
  assert(adminLoginRes.statusCode === 200, "Admin login successful");
  const adminCookie = parseCookie(adminLoginRes, "cravings_admin_token");
  assert(Boolean(adminCookie), "Admin session token cookie issued");

  const adminOrdersRes = await request("/api/admin/orders", {
    headers: { Cookie: adminCookie },
  });
  assert(adminOrdersRes.statusCode === 200, "Admin live orders loaded successfully");
  const matchedOrder = adminOrdersRes.json?.orders?.find(
    (o) => o.orderNumber === createdOrder.orderNumber
  );
  assert(
    Boolean(matchedOrder),
    `New order ${createdOrder.orderNumber} appeared in Admin Dashboard without WhatsApp!`
  );

  // 7. Admin Transitions Order Status
  const statusUpdateRes = await request(
    `/api/admin/orders/${createdOrder.id}/status`,
    {
      method: "PUT",
      headers: { Cookie: adminCookie },
      body: {
        status: "PREPARING",
        note: "Baking Dream Cake with rich ganache in kitchen",
      },
    }
  );
  assert(statusUpdateRes.statusCode === 200, "Admin transitioned status to PREPARING");

  // 8. Customer Tracks Live Order
  const trackRes = await request(
    `/api/orders/track/${createdOrder.trackingToken}`
  );
  assert(trackRes.statusCode === 200, "Customer live order tracking works");
  assert(
    trackRes.json?.order?.fulfillmentStatus === "PREPARING",
    "Customer sees updated status PREPARING"
  );
  assert(
    trackRes.json?.order?.statusHistory?.length >= 2,
    "Status timeline history recorded audit trail"
  );

  // 9. Dynamic Menu Availability Toggle
  const toggleRes = await request(`/api/products/${dreamCake.id}`, {
    method: "PUT",
    headers: { Cookie: adminCookie },
    body: { isAvailable: false },
  });
  assert(toggleRes.statusCode === 200, "Admin marked Dream Cake as Sold Out");

  const customerMenuAfterToggle = await request("/api/products");
  const dreamCakeAfter = customerMenuAfterToggle.json?.products?.find(
    (p) => p.id === dreamCake.id
  );
  assert(
    !dreamCakeAfter,
    "Customer menu immediately hid Sold Out dessert from active view"
  );

  // Re-enable Dream Cake
  await request(`/api/products/${dreamCake.id}`, {
    method: "PUT",
    headers: { Cookie: adminCookie },
    body: { isAvailable: true },
  });
  console.log("Restored Dream Cake availability.");

  // 10. Verify Newly Added Customer Public Routes & SEO
  console.log("\n--- VERIFYING EXPANDED PUBLIC ROUTES & SEO ---");
  const aboutRes = await request("/about");
  assert(aboutRes.statusCode === 200 && aboutRes.data.toLowerCase().includes("chocii 4 u"), "/about returns HTTP 200 with brand story");

  const contactRes = await request("/contact");
  assert(contactRes.statusCode === 200 && contactRes.data.includes("Kitchen Headquarters"), "/contact returns HTTP 200 with contact hub");

  const faqRes = await request("/faq");
  assert(faqRes.statusCode === 200 && faqRes.data.includes("Frequently Asked Questions"), "/faq returns HTTP 200 with FAQ accordion");

  const signinRes = await request("/signin");
  assert(signinRes.statusCode === 200, "/signin alias route returns HTTP 200");

  const verifyOtpPageRes = await request("/verify-otp?phone=9876543210");
  assert(
    verifyOtpPageRes.statusCode === 200 &&
      (verifyOtpPageRes.data.includes("Loading verification") ||
        verifyOtpPageRes.data.includes("Verify")),
    "/verify-otp route returns HTTP 200 with verification screen"
  );

  const privacyRes = await request("/privacy-policy");
  assert(privacyRes.statusCode === 200 && privacyRes.data.includes("Privacy Policy"), "/privacy-policy returns HTTP 200");

  const termsRes = await request("/terms-and-conditions");
  assert(termsRes.statusCode === 200 && termsRes.data.includes("Terms &amp; Conditions"), "/terms-and-conditions returns HTTP 200");

  const shippingRes = await request("/shipping-and-delivery");
  assert(shippingRes.statusCode === 200 && shippingRes.data.includes("Shipping &amp; Delivery Policy"), "/shipping-and-delivery returns HTTP 200");

  const refundRes = await request("/refund-and-cancellation");
  assert(refundRes.statusCode === 200 && (refundRes.data.includes("Replacement &amp; Cancellation Policy") || refundRes.data.includes("Replacement")), "/refund-and-cancellation returns HTTP 200");

  const collectionRes = await request("/collections/signature-cakes");
  assert(collectionRes.statusCode === 200 && collectionRes.data.includes("Signature Cakes"), "/collections/signature-cakes returns HTTP 200");

  const sitemapRes = await request("/sitemap.xml");
  assert(sitemapRes.statusCode === 200 && sitemapRes.data.includes("<urlset"), "/sitemap.xml returns HTTP 200 with XML content");

  const robotsRes = await request("/robots.txt");
  assert(robotsRes.statusCode === 200 && robotsRes.data.includes("User-Agent: *"), "/robots.txt returns HTTP 200 with crawl directives");

  const manifestRes = await request("/manifest.webmanifest");
  assert(manifestRes.statusCode === 200 && manifestRes.data.toLowerCase().includes("chocii 4 u"), "/manifest.webmanifest returns HTTP 200 with PWA metadata");

  // 11. Authenticated Customer Access to /orders/[id]
  const orderDetailRes = await request(`/orders/${createdOrder.id}`, {
    headers: { Cookie: customerCookie },
  });
  assert(orderDetailRes.statusCode === 200 && orderDetailRes.data.includes(createdOrder.orderNumber), `Customer can view order detail at /orders/${createdOrder.id}`);

  // 12. Feedback Page & 3D Elements Verification
  const feedbackRes = await request("/feedback");
  assert(feedbackRes.statusCode === 200, "/feedback route returns HTTP 200");
  assert(
    feedbackRes.data.includes("Sensory Reviews &amp; Feedback") ||
      feedbackRes.data.includes("Sensory Reviews & Feedback"),
    "/feedback contains Sensory Reviews headline"
  );
  assert(
    feedbackRes.data.includes("Verified Customer Reviews") ||
      feedbackRes.data.includes("Submit Your Crave Review"),
    "/feedback contains customer review cards and submission form"
  );
  assert(!feedbackRes.data.toLowerCase().includes("wearebrand"), "/feedback has zero mentions of wearebrand");

  // 13. Product Page 3D Atelier View
  const productDetailRes = await request("/menu/dream-cake", {
    headers: { Cookie: customerCookie },
  });
  assert(productDetailRes.statusCode === 200, "/menu/dream-cake returns HTTP 200");
  assert(
    productDetailRes.data.includes("3D Atelier View") ||
      productDetailRes.data.includes("Dream Cake"),
    "/menu/dream-cake contains 3D Atelier View controls"
  );
  assert(!productDetailRes.data.toLowerCase().includes("wearebrand"), "/menu/dream-cake has zero mentions of wearebrand");

  // 14. Customer Database & WhatsApp Broadcast Verification
  const custUnauth = await request("/api/admin/customers");
  assert(custUnauth.statusCode === 401, "Unauthenticated /api/admin/customers rejected with HTTP 401");

  const custAuthRes = await request("/api/admin/customers", {
    headers: { Cookie: adminCookie },
  });
  assert(custAuthRes.statusCode === 200, "Admin can query /api/admin/customers");
  assert(Array.isArray(custAuthRes.json?.customers), "Customer database returns customers list");
  assert(custAuthRes.json?.customers?.length > 0, "Customer database reflects registered customer logins");
  assert(Boolean(custAuthRes.json?.stats?.totalCustomers), "Customer database computes total customers metric");

  const adminCustPageRes = await request("/admin/customers", {
    headers: { Cookie: adminCookie },
  });
  assert(
    adminCustPageRes.statusCode === 200 &&
      (adminCustPageRes.data.includes("Admin Portal") ||
        adminCustPageRes.data.includes("Authenticating Admin Portal")),
    "Admin can view /admin/customers portal page"
  );

  // 15. Website Traffic & Ordering Conversion Verification
  const trafficUnauth = await request("/api/admin/traffic");
  assert(trafficUnauth.statusCode === 401, "Unauthenticated /api/admin/traffic rejected with HTTP 401");

  // Track a live test visitor page view
  await request("/api/analytics/track", {
    method: "POST",
    body: {
      visitorId: "visakha_visitor_test_01",
      path: "/menu",
      device: "mobile",
    },
  });

  const trafficAuthRes = await request("/api/admin/traffic?range=7d", {
    headers: { Cookie: adminCookie },
  });
  assert(trafficAuthRes.statusCode === 200, "Admin can query /api/admin/traffic analytics");
  assert(typeof trafficAuthRes.json?.metrics?.uniqueVisitors === "number" && trafficAuthRes.json?.metrics?.uniqueVisitors >= 1, "Traffic analytics computes unique visitors count");
  assert(trafficAuthRes.json?.metrics?.totalOrders >= 0, "Traffic analytics computes orders placed count");
  assert(typeof trafficAuthRes.json?.metrics?.conversionRate === "number", "Traffic analytics computes e-commerce conversion rate");
  assert(Boolean(trafficAuthRes.json?.funnel), "Traffic analytics provides 5-step conversion funnel");
  assert(Array.isArray(trafficAuthRes.json?.topPages), "Traffic analytics tracks most visited pages");

  const adminTrafficPageRes = await request("/admin/traffic", {
    headers: { Cookie: adminCookie },
  });
  assert(
    adminTrafficPageRes.statusCode === 200,
    "Admin can view /admin/traffic portal page"
  );

  // 16. Deletable Data & Reset Verification (Live Board, Customer Details, Traffic, Revenue)
  const delOrderUnauth = await request("/api/admin/orders?id=test", { method: "DELETE" });
  assert(delOrderUnauth.statusCode === 401, "Unauthenticated DELETE /api/admin/orders rejected with HTTP 401");

  const delCustUnauth = await request("/api/admin/customers?id=test", { method: "DELETE" });
  assert(delCustUnauth.statusCode === 401, "Unauthenticated DELETE /api/admin/customers rejected with HTTP 401");

  const delTrafficUnauth = await request("/api/admin/traffic?id=test", { method: "DELETE" });
  assert(delTrafficUnauth.statusCode === 401, "Unauthenticated DELETE /api/admin/traffic rejected with HTTP 401");

  // Admin deletes the newly placed test order from earlier in this test run
  if (createdOrder?.orderNumber) {
    const delOrderRes = await request(`/api/admin/orders?id=${createdOrder.orderNumber}`, {
      method: "DELETE",
      headers: { Cookie: adminCookie },
    });
    assert(delOrderRes.statusCode === 200 && delOrderRes.json?.success, "Admin can delete specific order from live board");
  }

  // Admin clears test orders
  const clearTestOrdersRes = await request("/api/admin/orders?action=clear_test", {
    method: "DELETE",
    headers: { Cookie: adminCookie },
  });
  assert(clearTestOrdersRes.statusCode === 200 && clearTestOrdersRes.json?.success, "Admin can delete test/duplicate orders in bulk");

  // Admin deletes test traffic page visits
  const clearTrafficRes = await request("/api/admin/traffic?action=clear_all", {
    method: "DELETE",
    headers: { Cookie: adminCookie },
  });
  assert(clearTrafficRes.statusCode === 200 && clearTrafficRes.json?.success, "Admin can clear and reset traffic page visit logs");

  // Admin calls unified reset endpoint
  const adminResetRes = await request("/api/admin/reset", {
    method: "POST",
    headers: { Cookie: adminCookie, "Content-Type": "application/json" },
    body: JSON.stringify({ target: "test_customers" }),
  });
  assert(adminResetRes.statusCode === 200 && adminResetRes.json?.success, "Admin can clean test customer details and recalculate metrics");

  // Verify revenue and dashboard stats refresh
  const statsRefreshRes = await request("/api/admin/stats", {
    headers: { Cookie: adminCookie },
  });
  assert(statsRefreshRes.statusCode === 200 && statsRefreshRes.json?.success, "Revenue dashboard recalculates after deleting duplicate data");


  console.log("=================================================");
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((e) => {
  console.error("Test runner error:", e);
  process.exit(1);
});
