import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "chocii 4 u — A Little Treat, Just for You.",
    short_name: "chocii 4 u",
    description: "A Little Treat, Just for You. Desserts prepared in Visakhapatnam.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
