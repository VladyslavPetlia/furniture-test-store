import { Skeleton } from "@/components/ui/skeleton"

export function FilterCarouselListSkeleton({
  hasTitle = true,
}: {
  hasTitle?: boolean
}) {
  const skeletonItems = Array.from({ length: 4 })

  return (
    <nav className="mx-auto mb-20 max-w-(--breakpoint-2xl) px-4">
      {hasTitle && (
        <Skeleton className="mx-auto my-10 h-10 w-48 animate-pulse rounded-md" />
      )}

      <ul className="mx-auto flex h-full min-h-90 w-full flex-col items-center justify-center gap-15 pt-2 md:flex-row md:justify-normal md:gap-0 md:overflow-x-auto">
        {skeletonItems.map((_, i) => (
          <li
            key={`filter-skeleton-${i}`}
            className="mx-5 block h-full w-full max-w-100 sm:max-w-120 md:max-w-70 md:min-w-60"
          >
            <Skeleton className="relative flex aspect-square animate-pulse items-center rounded-lg">
              <Skeleton className="absolute right-[50%] bottom-[-15] h-8 w-24 translate-[50%] rounded" />
            </Skeleton>
          </li>
        ))}
      </ul>
    </nav>
  )
}
