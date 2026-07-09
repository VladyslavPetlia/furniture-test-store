import { Skeleton } from "@/components/ui/skeleton"

export default function FilterCarouselListSkeleton({
  title,
  count = 4, // Default number of skeleton items to render
}: {
  title?: string
  count?: number
}) {
  // Create an array based on the requested count to loop over
  const skeletonItems = Array.from({ length: count })

  return (
    <nav className="mx-auto mb-31 max-w-7xl animate-pulse px-4">
      {/* Title Skeleton */}
      {title ? (
        <h3 className="mt-30 mb-10 text-center font-mono text-4xl text-black md:block dark:text-white">
          {title}
        </h3>
      ) : (
        // Neutral title line if no explicit text is provided but space needs to be kept
        <Skeleton className="mx-auto mt-30 mb-10 h-10 w-48" />
      )}

      {/* Grid / Carousel List Skeleton Container */}
      <ul className="mx-auto flex h-full w-full flex-col items-center justify-center gap-15 lg:flex-row lg:gap-0 lg:overflow-x-auto">
        {skeletonItems.map((_, i) => (
          <li key={i} className="w-full min-w-50 shrink-0 p-2 lg:w-auto">
            {/* Inner Card Item Wrapper */}
            <Skeleton className="flex flex-col items-center gap-4 p-4">
              {/* Image Circle/Square Placeholder */}
              <Skeleton className="h-24 w-24 md:h-32 md:w-32" />

              {/* Text Label Placeholder */}
              <Skeleton className="h-5 w-28" />
            </Skeleton>
          </li>
        ))}
      </ul>
    </nav>
  )
}
