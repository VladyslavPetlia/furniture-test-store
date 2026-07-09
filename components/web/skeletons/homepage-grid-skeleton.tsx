import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { clsx } from "clsx"
import Link from "next/link"

export default function HomepageGridSkeleton({
  count = 4, // Matches your lg:grid-cols-4 screen layout tier
}: {
  count?: number
}) {
  const skeletonItems = Array.from({ length: count })

  return (
    <Skeleton className="animate-pulse">
      {/* Static Title (Kept visible immediately for better user experience) */}
      <h3 className="mt-10 text-center font-mono text-4xl text-black md:block dark:text-white">
        Our Products
      </h3>

      {/* Grid Container (Matches exact responsive columns & margin paddings) */}
      <Skeleton className="mx-auto mt-10 mb-10 grid max-w-7xl grid-cols-1 gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4">
        {skeletonItems.map((_, i) => (
          <Skeleton
            key={i}
            className="relative flex aspect-square w-full flex-col justify-end overflow-hidden p-4"
          >
            {/* Inner bottom details banner layout mimic */}
            <Skeleton className="flex w-full items-center justify-between p-3">
              {/* Product Title Line Placeholder */}
              <Skeleton className="h-4 w-1/2" />

              {/* Product Price Pill Placeholder */}
              <Skeleton className="h-5 w-16" />
            </Skeleton>
          </Skeleton>
        ))}
      </Skeleton>

      {/* Static Button (Kept visible immediately so UI interactive layout remains ready) */}
      <Skeleton className="flex items-center justify-center">
        <Link
          href="/search"
          className={clsx(buttonVariants({}), "mb-26 px-8 py-6 text-lg")}
        >
          <p className="text-lg">See More</p>
        </Link>
      </Skeleton>
    </Skeleton>
  )
}
