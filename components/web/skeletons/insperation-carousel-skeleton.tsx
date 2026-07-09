import { Skeleton } from "@/components/ui/skeleton"

export default function InspirationCarouselSkeleton({
  count = 2, // Matches visibility for typical desktop view sizes (md:basis-1/2)
}: {
  count?: number
}) {
  const skeletonItems = Array.from({ length: count })

  return (
    <Skeleton className="relative mx-auto mb-20 w-full max-w-7xl px-15 py-20">
      <Skeleton className="flex flex-col gap-20 lg:flex-row lg:gap-15">
        {/* Left Side Static Text Content Skeleton */}
        <Skeleton className="flex w-full flex-col justify-center lg:w-1/3">
          {/* Header text placeholder */}
          <Skeleton className="mb-2 h-9 w-11/12 py-2" />

          {/* Paragraph line placeholders */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Button placeholder */}
          <Skeleton className="my-5 h-14 w-60" />
        </Skeleton>

        {/* Right Side Carousel Items Mock Grid */}
        <Skeleton className="w-full lg:w-2/3">
          <Skeleton className="flex gap-4 overflow-hidden">
            {skeletonItems.map((_, index) => (
              <Skeleton
                key={index}
                className="shrink-0 basis-full md:basis-1/2"
              >
                {/* Simulated shadcn Card design structure */}
                <Skeleton className="overflow-hidden shadow">
                  {/* Image space constraint with strict 3:4 aspect ratio layout */}
                  <Skeleton className="relative aspect-3/4 w-full" />

                  {/* Header text layouts beneath image box area */}
                  <Skeleton className="space-y-3 bg-primary p-6">
                    {/* CardTitle text line placeholder */}
                    <Skeleton className="h-7 w-2/3" />

                    {/* CardDescription minimum block space allocation lines */}
                    <Skeleton className="min-h-4rem max-h-4rem mt-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </Skeleton>
                  </Skeleton>
                </Skeleton>
              </Skeleton>
            ))}
          </Skeleton>
        </Skeleton>
      </Skeleton>
    </Skeleton>
  )
}
