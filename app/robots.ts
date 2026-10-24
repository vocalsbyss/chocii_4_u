import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://chocii4u.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/menu",
          "/menu/*",
          "/collections/*",
          "/about",
          "/contact",
          "/faq",
          "/shipping-and-delivery",
          "/refund-and-cancellation",
          "/privacy-policy",
          "/terms-and-conditions",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/checkout",
          "/cart",
          "/orders",
          "/orders/*",
          "/track-order",
          "/sign-in",
          "/signin",
          "/verify-otp",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
