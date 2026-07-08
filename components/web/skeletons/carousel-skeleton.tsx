import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel" // Adjust path if needed
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCarouselSkeleton() {
  // Renders 5 placeholders to match the xl:basis-1/5 maximum view
  const skeletonItems = Array.from({ length: 5 })

  return (
    <div
      className="w-full overflow-hidden pt-1 pb-6"
      style={{ contain: "layout paint" }}
    >
      <Carousel className="mx-auto w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        <CarouselContent className="-ml-4">
          {skeletonItems.map((_, i) => (
            <CarouselItem
              key={`skeleton-${i}`}
              className="basis-1/1 pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/5"
            >
              <div className="p-1">
                {/* Pure aspect-square block with a pulse animation */}
                <Skeleton className="relative block aspect-square h-full w-full rounded-lg" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="translate-y-0" />
        <CarouselNext className="translate-y-0" />
      </Carousel>
    </div>
  )
}
