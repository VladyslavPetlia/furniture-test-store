import { Skeleton } from "@/components/ui/skeleton"

export function HeroSkeleton() {
  return (
    <div className="relative mx-auto my-4 flex h-225 max-w-(--breakpoint-2xl) animate-pulse flex-col items-center justify-around overflow-hidden rounded-2xl bg-neutral-200 md:flex-row dark:bg-neutral-800">
      {/* Content wrapper layout */}
      {/* <div className="relative md:ml-10"> */}
      {/* Heading skeleton lines matched to w-80, w-120, and w-145 */}
      {/* <div className="mb-6 w-80 space-y-3 md:w-120 lg:w-145">
          <Skeleton className="h-9 w-full rounded-md md:h-11 lg:h-16" />
          <Skeleton className="h-9 w-2/3 rounded-md md:h-11 lg:h-16" />
        </div> */}

      {/* Paragraph skeleton lines matched to w-85, w-120, and w-135 */}
      {/* <div className="mb-6 w-85 space-y-2 md:w-120 lg:w-135">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div> */}

      {/* Button frame skeleton */}
      {/* <div className="flex items-center">
          <Skeleton className="h-11 w-32 rounded-md" />
        </div>
      </div> */}

      {/* Pure image placeholder matched to exact h and w styling overrides */}
      <div className="relative">
        <Skeleton className="h-120 w-80 rounded-lg md:h-150 md:w-100 lg:h-200 lg:w-150" />
      </div>
    </div>
  )
}
