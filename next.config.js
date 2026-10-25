/** @type {import('next').NextConfig} */
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) {
  delete process.env.DATABASE_URL;
}

const nextConfig = {
  env: {
    DATABASE_URL: "file:./dev.db",
  },
  reactStrictMode: true,
  experimental: {
    outputFileTracingIncludes: {
      "/**": ["./prisma/dev.db"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.openai.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};

module.exports = nextConfig;
