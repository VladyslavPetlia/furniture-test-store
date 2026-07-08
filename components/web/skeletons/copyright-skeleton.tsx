import { Skeleton } from "@/components/ui/skeleton"

export function CopyrightSkeleton() {
  return (
    <div className="border-t py-6 text-sm">
      <Skeleton className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 min-[1320px]:px-0 md:flex-row md:gap-0 md:px-4">
        {/* Simple non-pulsing text line block representing copyright constraints */}
        <Skeleton className="h-4 w-52 rounded" />
      </Skeleton>
    </div>
  )
}
