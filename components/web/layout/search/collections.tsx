import { getCollections } from "@/lib/shopify"
import FilterList from "./filter"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

async function CollectionList() {
  const collections = await getCollections()
  return <FilterList list={collections} title="Collections" />
}

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-100 w-full flex-none py-4 lg:block">
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="mb-3 h-4 w-5/6" />
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  )
}
