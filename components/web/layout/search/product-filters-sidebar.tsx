import { shopifyFetch } from "@/lib/shopify"
import { FilterSidebar } from "@/components/ui/filter-sidebar"
import { getProductsWithFiltersAndSortQuery } from "@/lib/shopify/queries/product"

interface FilterGroup {
  id: string
  label: string
  type: string
  values: Array<{ id: string; label: string; count: number }>
}

export default async function ProductFiltersSidebar({
  searchParams,
}: {
  searchParams?: { q?: string }
}) {
  const activeSearchQuery = searchParams?.q || ""

  interface ShopifyFilterOperation {
    data: {
      search: {
        productFilters: FilterGroup[]
      }
    }
    variables: {
      query: string
      sortKey: string
      reverse: boolean
      productFilters: any[] // MATCHED: Renamed variable array reference to match schema definitions
    }
  }

  try {
    const res = await shopifyFetch<ShopifyFilterOperation>({
      query: getProductsWithFiltersAndSortQuery,
      variables: {
        query: activeSearchQuery,
        sortKey: "RELEVANCE",
        reverse: false,
        productFilters: [],
      },
    })

    const filterGroups = res.body?.data?.search?.productFilters || []

    if (filterGroups.length === 0) return null

    return (
      <div className="my-4">
        <h3 className="text-neutral-500 dark:text-neutral-400">
          Refine Results
        </h3>
        <FilterSidebar filterGroups={filterGroups} />
      </div>
    )
  } catch (error: any) {
    const isAborted =
      error?.message?.includes("During prerendering, fetch() rejects") ||
      error?.message?.includes("This operation was aborted") ||
      error?.name === "AbortError"

    if (!isAborted) {
      console.error("Failed to load search filter blocks:", error)
    }

    // Return your empty fallback layout so the build worker completes gracefully
    return []
  }
}
