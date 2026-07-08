import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
  allowedDevOrigins: ["*.trycloudflare.com", "*.ngrok-free.app", "*.ngrok.io"],
  experimental: {
    inlineCss: true, // Eliminates the render-blocking waterfall entirely
    serverActions: {
      allowedOrigins: ["*.trycloudflare.com", "*.ngrok-free.app", "*.ngrok.io"],
    },
  },
}

export default nextConfig
