"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "@/lib/shopify/types"
import { Menu as MenuIcon } from "lucide-react"
import Link from "next/link"
import { Suspense, useState } from "react"
import Search, { SearchSkeleton } from "./search"
import clsx from "clsx"

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const [open, setOpen] = useState(false)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      setOpen(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="ring-1 ring-transparent hover:ring-primary"
          variant="outline"
          aria-label="Open menu"
        >
          <MenuIcon className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" onKeyDown={handleKeyDown}>
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>
            Browse categories and search products
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="mt-14 mb-4 w-full">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
          {menu.length ? (
            <ul className="flex w-full flex-col">
              {menu.map((item: Menu) => (
                <SheetClose asChild key={item.path}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    className={clsx(
                      "mb-4 flex h-11 px-4 text-lg font-medium ring-1 ring-transparent hover:ring-primary",
                      buttonVariants({ variant: "secondary" })
                    )}
                  >
                    {item.title}
                  </Link>
                </SheetClose>
              ))}
            </ul>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
