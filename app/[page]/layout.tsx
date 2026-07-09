import { Skeleton } from "@/components/ui/skeleton"
import Footer from "@/components/web/layout/footer"
import { Suspense } from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense
        fallback={
          <div className="mx-8 max-w-2xl py-20 sm:mx-auto">
            <Skeleton className="mb-4 h-14 w-35" />
            <Skeleton className="h-100 w-full" />
          </div>
        }
      >
        <div className="w-full">
          <div className="mx-8 max-w-2xl py-20 sm:mx-auto">{children}</div>
        </div>
      </Suspense>
      <Footer />
    </>
  )
}
