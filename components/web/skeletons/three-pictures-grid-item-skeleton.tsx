import { Skeleton } from "@/components/ui/skeleton"

export function ThreePicturesGridItemSkeleton({
  size,
}: {
  size: "full" | "half"
}) {
  return (
    <div
      className={
        size === "full"
          ? "overflow-hidden rounded-2xl md:col-span-2 md:row-span-2"
          : "overflow-hidden rounded-xl md:col-span-1 md:row-span-1"
      }
    >
      {/* Pure aspect-square block with a pulse animation */}
      <Skeleton className="relative block aspect-square h-full w-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />
    </div>
  )
}
