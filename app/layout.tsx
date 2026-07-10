import { Aboreto, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { baseUrl, cn } from "@/lib/utils"
import { Metadata } from "next"
import { Navbar } from "@/components/web/layout/navbar"
import { CartProvider } from "@/components/web/cart/cart-context"
import { getCart } from "@/lib/shopify"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Aboreto({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
})

const { SITE_NAME } = process.env

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
  // This explicitly pushes the image download to the front of the browser queue
  other: {
    rel: "preload",
    as: "image",
    href: "/_next/image?url=%2Fhero.webp&w=768&q=70",
    imagesrcset:
      "/_next/image?url=%2Fhero.webp&w=640&q=70 640w, /_next/image?url=%2Fhero.webp&w=768&q=70 768w, /_next/image?url=%2Fhero.webp&w=1200&q=70 1200w",
    imagesizes: "(min-width: 1340px) 1200px, 100vw",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cart = getCart()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="bg-secondary text-black selection:bg-teal-300 dark:text-white dark:selection:bg-primary dark:selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <CartProvider cartPromise={cart}>
            <Suspense fallback={<Skeleton className="h-16" />}>
              <Navbar />
            </Suspense>
            <main>{children}</main>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
