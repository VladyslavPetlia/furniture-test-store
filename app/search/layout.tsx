import { Suspense } from "react"
import { sorting } from "@/lib/constants"
import Footer from "@/components/web/layout/footer"
import Collections from "@/components/web/layout/search/collections"
import ChildrenWrapper from "@/app/search/children-wrapper"
import FilterList from "@/components/web/layout/search/filter"
import ProductFiltersSidebar from "@/components/web/layout/search/product-filters-sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default async function SearchLayout(props: {
  children: React.ReactNode
  searchParams?: Promise<{ q?: string }>
}) {
  const resolvedParams = (await props.searchParams) || {}

  return (
    <>
      <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
        <div>
          <Suspense fallback={<Skeleton className="h-11 w-30" />}>
            <Collections />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-11 w-30" />}>
            <ProductFiltersSidebar searchParams={resolvedParams} />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-11 w-30" />}>
            <FilterList list={sorting} title="Sort by" />
          </Suspense>
        </div>
        <div className="min-h-screen w-full flex-1">
          <Suspense fallback={null}>
            <ChildrenWrapper>{props.children}</ChildrenWrapper>
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  )
}
