"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export function WelcomeToast() {
  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 650) return
    if (!document.cookie.includes("welcome-toast=2")) {
      toast("🛍️ Welcome to Testing-Next-Store!", {
        id: "welcome-toast",
        duration: Infinity,
        onDismiss: () => {
          document.cookie = "welcome-toast=2; max-age=31536000; path=/"
        },
        description: (
          <>
            This is a high-performance, storefront build with Shopify, Next.js,
            and Vercel. PS. This is just test store,{" "}
            <span className="underline">products not real!</span>
          </>
        ),
      })
    }
  }, [])

  return null
}
