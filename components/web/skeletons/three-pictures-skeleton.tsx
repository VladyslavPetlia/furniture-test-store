import { Skeleton } from "@/components/ui/skeleton"
import { ThreePicturesGridItemSkeleton } from "./three-pictures-grid-item-skeleton"

export function ThreePicturesSkeleton() {
  return (
    <section className="mx-auto grid max-w-(--breakpoint-2xl) gap-4 px-4 pb-4 md:grid-cols-4 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      {/* Skeleton placeholders matching the real layout item configurations */}
      <ThreePicturesGridItemSkeleton size="full" />
      <ThreePicturesGridItemSkeleton size="half" />
      <ThreePicturesGridItemSkeleton size="half" />

      {/* Pure text block placeholders masking headings, buttons, and paragraphs */}
      <div className="md:col-span-2 md:row-span-1">
        {/* Heading skeleton lines */}
        <div className="mb-20 space-y-3 md:mb-10 lg:mb-20">
          <Skeleton className="h-9 w-3/4 rounded-md" />
          <Skeleton className="h-9 w-1/2 rounded-md" />
        </div>

        {/* Action area layout skeletons */}
        <div className="flex flex-col lg:flex-row">
          {/* MainButton skeleton placeholder */}
          <div className="mr-15 mb-10">
            <Skeleton className="h-15 w-50 rounded-md" />
          </div>

          {/* Description paragraph skeleton lines */}
          <div className="w-full space-y-2">
            <Skeleton className="h-5 w-full rounded" />
            <Skeleton className="h-5 w-5/6 rounded" />
          </div>
        </div>
      </div>
    </section>
  )
}
