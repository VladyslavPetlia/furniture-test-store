import { getMenu } from "@/lib/shopify"
import { Suspense } from "react"
import MobileMenu from "./mobile-menu"
import Link from "next/link"
import LogoSquare from "../../logo-square"
import { Button } from "@/components/ui/button"
import { Menu } from "@/lib/shopify/types"
import Search, { SearchSkeleton } from "./search"
import { ModeToggle } from "./mode-togle"
import CartModal from "../../cart/modal"
import { Skeleton } from "@/components/ui/skeleton"
import { ProfileLink } from "../../profule-link"

const { SITE_NAME } = process.env

export async function Navbar() {
  const menu = await getMenu("next-js-frontend-header-menu")

  return (
    <nav className="relative z-50 p-9 lg:px-11">
      <div className="fixed top-0 right-0 left-0 flex items-center justify-between bg-neutral-50 p-4 lg:px-6 dark:bg-neutral-900">
        <div className="md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>
        <div className="">
          <Link
            href="/"
            prefetch={true}
            className="flex w-full cursor-pointer items-center md:mr-2 md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="ml-2 flex-none font-mono text-lg uppercase">
              {SITE_NAME}
            </div>
          </Link>
        </div>
        <div>
          {menu.length ? (
            <div className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <Link href={item.path} key={item.title} prefetch={true}>
                  <Button
                    variant="outline"
                    className="min-w-15 cursor-pointer ring-1 ring-transparent hover:ring-primary"
                    aria-label={item.title}
                  >
                    {item.title}
                  </Button>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex gap-4">
          <>
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </>
          <>
            <ModeToggle />
          </>
          <>
            <Suspense fallback={<Skeleton className="size-10" />}>
              <ProfileLink />
            </Suspense>
          </>
          <>
            <Suspense fallback={<Skeleton className="size-9.5" />}>
              <CartModal />
            </Suspense>
          </>
        </div>
      </div>
    </nav>
  )
}
