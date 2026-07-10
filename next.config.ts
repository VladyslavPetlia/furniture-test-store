import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 65, 70, 75],
    // Tailwind default breakpoints: sm(640), md(768), lg(1024), xl(1280), 2xl(1536)
    deviceSizes: [640, 768, 1024, 1280, 1335, 1536],
    // Fills in smaller standard size increments for small UI grid layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
