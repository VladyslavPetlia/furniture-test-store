"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Menu } from "@/lib/shopify/types"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx" //  Optional: used below if you want to style the active link

export function FooterMenuItem({ item }: { item: Menu }) {
  const pathname = usePathname()

  const isActive = pathname === item.path

  return (
    //  Tip: You can use 'isActive' here to visually highlight the current page
    <Link href={item.path} className="flex items-center">
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={clsx("cursor-pointer", isActive && "font-bold")}
        aria-label={item.title}
      >
        {item.title}
      </Button>
    </Link>
  )
}

export default function FooterMenu({ menu }: { menu: Menu[] }) {
  if (!menu.length) return null

  return (
    <nav>
      <div>
        {menu.map((item: Menu) => {
          return <FooterMenuItem key={item.title} item={item} />
        })}
      </div>
    </nav>
  )
}
