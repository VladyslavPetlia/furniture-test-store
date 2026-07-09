import { Skeleton } from "@/components/ui/skeleton"

export default function ProductGridItemsSkeleton({
  count = 8, // Sensible default to fill the grid across xl screens
}: {
  count?: number
}) {
  const skeletonItems = Array.from({ length: count })

  return (
    <Skeleton className="mt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {skeletonItems.map((_, i) => (
        // Simulates the outer Grid.Item container structure
        <Skeleton
          key={i}
          className="relative flex aspect-3/4 w-full flex-col justify-end bg-neutral-100 p-4 dark:bg-neutral-900"
        >
          {/* Bottom Floating Content Label Banner */}
          <Skeleton className="flex w-full items-center justify-between border border-neutral-200 bg-white/70 p-3 backdrop-blur-md dark:border-neutral-800 dark:bg-black/70">
            {/* Product Title Label Line Placeholder */}
            <Skeleton className="h-4 w-1/2 bg-neutral-300 dark:bg-neutral-700" />

            {/* Product Price Tag Pill Placeholder */}
            <Skeleton className="h-5 w-16 bg-neutral-400 dark:bg-neutral-600" />
          </Skeleton>
        </Skeleton>
      ))}
    </Skeleton>
  )
}
