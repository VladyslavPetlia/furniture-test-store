import { Suspense } from "react"
import Grid from "@/components/web/grid"
import ProductGridItems from "@/components/web/layout/product-grid-items"
import { defaultSort, sorting } from "@/lib/constants"
import { getProducts } from "@/lib/shopify"
import { parseUrlParamsToShopifyFilters } from "@/lib/shopify/filters"
import ProductGridItemsSkeleton from "@/components/web/skeletons/product-gtrid-items-skeleton"

// 1. Create a dedicated Search Results child component to handle the dynamic API query
async function SearchResults({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedParams = (await searchParams) || {}
  const sortParam =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : undefined
  const searchValue =
    typeof resolvedParams.q === "string" ? resolvedParams.q : ""

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sortParam) || defaultSort

  const nativeSearchParams = new URLSearchParams()
  Object.entries(resolvedParams).forEach(([key, val]) => {
    if (val) {
      if (Array.isArray(val)) {
        val.forEach((v) => {
          if (typeof v === "string") nativeSearchParams.append(key, v)
        })
      } else if (typeof val === "string") {
        nativeSearchParams.append(key, val)
      }
    }
  })

  const activeFilters = parseUrlParamsToShopifyFilters(nativeSearchParams)

  const products = await getProducts({
    query: searchValue,
    sortKey,
    reverse,
    filters: activeFilters,
  })

  return products.length > 0 ? (
    <Grid className="mt-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <ProductGridItems products={products} />
    </Grid>
  ) : (
    <p className="py-12 text-sm text-muted-foreground">
      No products match your parameters.
    </p>
  )
}

// 2. Main Page serves the fast static shell and wraps the dynamic zone in Suspense
export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <Suspense fallback={<ProductGridItemsSkeleton />}>
      <SearchResults searchParams={props.searchParams!} />
    </Suspense>
  )
}
