import { Skeleton } from "@/components/ui/skeleton"

export default function HeroSkeleton() {
  return (
    <div className="relative mx-auto max-w-(--breakpoint-2xl) overflow-hidden">
      <div className="relative">
        <div className="relative h-full w-full pb-100 md:pb-0">
          {/* Image Placeholder */}
          <Skeleton className="h-auto min-h-100 w-full max-w-500 object-cover" />

          {/* Content Card Placeholder */}
          <div className="absolute top-[60%] left-[50%] w-full max-w-150 translate-x-[-50%] p-8 md:top-[50%] md:translate-x-0 md:translate-y-[-50%]">
            {/* Heading Skeleton Lines */}
            <div className="mb-6 space-y-3">
              <Skeleton className="h-8 w-11/12 md:h-10 lg:h-12" />
              <Skeleton className="h-8 w-8/12 md:h-10 lg:h-12" />
            </div>

            {/* Paragraph Skeleton Lines */}
            <div className="mb-6 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Button Placeholder */}
            <div className="flex items-center">
              <Skeleton className="h-11 w-36" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
