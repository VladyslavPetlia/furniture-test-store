"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { createUrl } from "@/lib/utils"
import type { SortFilterItem } from "@/lib/constants"
import type { ListItem, PathFilterItem } from "."
import { Button } from "@/components/ui/button"

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = pathname === item.path
  const newParams = new URLSearchParams(searchParams.toString())
  // const DynamicTag = active ? "p" : Link;

  newParams.delete("q")

  return (
    <li
      className="mt-4 flex justify-center text-black dark:text-white"
      key={item.title}
    >
      <Link href={createUrl(item.path, newParams)}>
        <Button
          variant="outline"
          className={clsx(
            // whitespace-normal h-auto py-2 text-left
            "inline-block w-[80vw] cursor-pointer overflow-x-hidden p-1.5 text-wrap ring-1 ring-transparent hover:ring-primary md:max-w-30 md:min-w-30",
            { "ring-2 ring-primary": active }
          )}
        >
          {item.title}
        </Button>
      </Link>
    </li>
  )
}

function SortFilterItem({ item }: { item: SortFilterItem }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get("sort") === item.slug
  const q = searchParams.get("q")
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(q && { q }),
      ...(item.slug && item.slug.length && { sort: item.slug }),
    })
  )
  // const DynamicTag = active ? "p" : Link;

  return (
    <li
      className="mt-4 flex justify-center text-sm text-black dark:text-white"
      key={item.title}
    >
      <Link prefetch={!active ? false : undefined} href={href}>
        <Button
          variant="outline"
          className={clsx(
            "inline-block w-[80vw] cursor-pointer overflow-x-hidden p-1.5 text-wrap ring-1 ring-transparent hover:ring-primary md:max-w-30 md:min-w-30",
            { "ring-2 ring-primary": active }
          )}
        >
          {item.title}
        </Button>
      </Link>
    </li>
  )
}

export function FilterItem({ item }: { item: ListItem }) {
  return "path" in item ? (
    <PathFilterItem item={item} />
  ) : (
    <SortFilterItem item={item} />
  )
}
