"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createUrl } from "@/lib/utils"
import { ListCarouselItem } from "."
import Image from "next/image"

function PathFilterItem({ item }: { item: ListCarouselItem }) {
  const searchParams = useSearchParams()
  const newParams = new URLSearchParams(searchParams.toString())
  // const DynamicTag = active ? "p" : Link;

  newParams.delete("q")

  return (
    <li
      className="mx-2 h-full w-full max-w-100 cursor-pointer sm:max-w-120 md:max-w-120 md:min-w-80 lg:max-w-100 xl:max-w-120"
      key={item.title}
    >
      <Link
        href={createUrl(item.path, newParams)}
        prefetch={true}
        aria-label={item.title}
        className="relative flex aspect-3/4 items-center overflow-hidden bg-secondary ring-1 ring-transparent hover:ring-primary"
      >
        <Image
          src={item.image}
          alt=""
          fill
          quality={70}
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 33vw, (min-width: 768px) 430px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-all hover:scale-105"
        />
      </Link>
      <Link
        href={createUrl(item.path, newParams)}
        prefetch={true}
        className="flex items-center justify-center py-6"
      >
        <h3 className="text-xl text-foreground">{item.title}</h3>
      </Link>
    </li>
  )
}

export function FilterCarouselItem({ item }: { item: ListCarouselItem }) {
  return "path" in item ? <PathFilterItem item={item} /> : null
}
