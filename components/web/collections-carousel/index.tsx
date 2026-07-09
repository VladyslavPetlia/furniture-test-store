import { Product } from "@/lib/shopify/types"
import { FilterCarouselItem } from "./carousel-item"

// 1. Updated the type definition to match what Shopify data passes down
export type ListCarouselItem = {
  title: string
  handle: string
  path: string
  image: string // <--- Added the image we injected earlier
  products: Product[] // <--- Added products array
}

function FilterItemList({ list }: { list: ListCarouselItem[] }) {
  return (
    <>
      {list.map((item: ListCarouselItem, i) => (
        // Each item now carries its own unique imageUrl inside it
        <FilterCarouselItem key={i} item={item} />
      ))}
    </>
  )
}

export default function FilterCarouselList({
  list,
  title,
}: {
  list: ListCarouselItem[]
  title?: string
}) {
  return (
    <>
      <nav className="mx-auto mb-31 max-w-7xl px-4">
        {title ? (
          <h3 className="mt-30 mb-10 text-center font-mono text-4xl text-black md:block dark:text-white">
            {title}
          </h3>
        ) : null}
        <ul className="mx-auto flex h-full w-full flex-col items-center justify-center gap-15 lg:flex-row lg:gap-0 lg:overflow-x-auto">
          <FilterItemList list={list} />
        </ul>
      </nav>
    </>
  )
}
