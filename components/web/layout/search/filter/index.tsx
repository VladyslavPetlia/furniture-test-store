import { Suspense } from "react"
import { SortFilterItem } from "@/lib/constants"
import FilterItemDropdown from "./dropdown"
import { FilterItem } from "./item"

// Explicitly define your missing type declarations
export type PathFilterItem = { title: string; path: string }
export type ListItem = SortFilterItem | PathFilterItem

// Self-contained list mapping component loop
function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <>
      {list.map((item: ListItem, i) => (
        <FilterItem key={i} item={item} />
      ))}
    </>
  )
}

export default function FilterList({
  list,
  title,
}: {
  list: ListItem[]
  title?: string
}) {
  return (
    <nav>
      {title ? (
        <h3 className="text-neutral-500 dark:text-neutral-400">{title}</h3>
      ) : null}
      {/* <ul className="hidden md:block">
        <Suspense fallback={null}>
          <FilterItemList list={list} />
        </Suspense>
      </ul> */}
      <ul className="">
        <Suspense fallback={null}>
          <FilterItemDropdown list={list} />
        </Suspense>
      </ul>
    </nav>
  )
}
