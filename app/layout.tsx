import { Aboreto, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { baseUrl, cn } from "@/lib/utils"
import { Metadata } from "next"
import { Navbar } from "@/components/web/layout/navbar"
import { WelcomeToast } from "@/components/web/welcome-toast"
import { CartProvider } from "@/components/web/cart/cart-context"
import { getCart } from "@/lib/shopify"
import { Toaster } from "sonner"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Aboreto({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
})

const { SITE_NAME } = process.env

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
  },
  robots: {
    follow: true,
    index: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Don't await the fetch, pass the Promise to the context provider
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
          // disableTransitionOnChange={false} // 👈 Change this from true to false
        >
          <CartProvider cartPromise={cart}>
            <Suspense fallback={<Skeleton className="h-16 rounded-xl" />}>
              <Navbar />
            </Suspense>
            <main>
              {children}
              <Toaster closeButton />
              <WelcomeToast />
            </main>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
