import { Skeleton } from "@/components/ui/skeleton"

export function ProductPageSkeleton() {
  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) animate-pulse px-4">
      {/* Main Container mirroring Gallery + Product Description */}
      <Skeleton className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
        {/* Left Side: Gallery Block */}
        <div className="h-full w-full basis-full lg:basis-4/6">
          <Skeleton className="relative aspect-square h-full max-h-137.5 w-full overflow-hidden rounded-md bg-neutral-200 dark:bg-neutral-800" />

          {/* Optional: Gallery Thumbnails track */}
          <div className="mt-4 flex gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-square w-20 rounded-md bg-neutral-200 dark:bg-neutral-800"
              />
            ))}
          </div>
        </div>

        {/* Right Side: Product Description Block */}
        <div className="basis-full space-y-6 pt-6 lg:basis-2/6 lg:pt-0">
          {/* Title */}
          <Skeleton className="h-8 w-3/4 rounded-md bg-neutral-200 dark:bg-neutral-800" />

          {/* Price Tag */}
          <Skeleton className="h-6 w-1/4 rounded-md bg-neutral-200 dark:bg-neutral-800" />

          {/* Variant Selector Blocks */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 rounded-md bg-neutral-200 dark:bg-neutral-800" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <Skeleton className="h-10 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <Skeleton className="h-10 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>

          {/* Description Text Lines */}
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full rounded-md bg-neutral-200 dark:bg-neutral-800" />
            <Skeleton className="h-4 w-full rounded-md bg-neutral-200 dark:bg-neutral-800" />
            <Skeleton className="h-4 w-2/3 rounded-md bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* Add to Cart Button */}
          <Skeleton className="h-12 w-full rounded-full bg-neutral-200 pt-4 dark:bg-neutral-800" />
        </div>
      </Skeleton>

      {/* Related Products Track */}
      <div className="py-8">
        {/* Section Title */}
        <Skeleton className="mb-4 h-8 w-48 rounded-md bg-neutral-200 dark:bg-neutral-800" />

        {/* Horizontal Scroll Items */}
        <ul className="flex w-full gap-4 overflow-x-auto p-1">
          {[...Array(5)].map((_, i) => (
            <li
              key={i}
              className="aspect-3/4 w-full flex-none rounded-md bg-neutral-200 min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 dark:bg-neutral-800"
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
