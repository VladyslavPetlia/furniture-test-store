import { getMenu } from "@/lib/shopify"
import Link from "next/link"
import { Suspense } from "react"
import LogoSquare from "../logo-square"
import FooterMenu from "./footer-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { CopyrightSkeleton } from "../skeletons/copyright-skeleton"
import { Copyright } from "./copyright"
import { FaFacebookSquare, FaGithub, FaLinkedin } from "react-icons/fa"
import clsx from "clsx"
import { buttonVariants } from "@/components/ui/button"

const { COMPANY_NAME, SITE_NAME } = process.env

export default async function Footer() {
  "use cache"

  const currentYear = new Date().getFullYear()
  const copyrightDate = 2026 + (currentYear > 2026 ? `-${currentYear}` : "")
  const menu = await getMenu("next-js-frontend-footer-menu")
  const menuSecondary = await getMenu("next-js-frontend-footer-menu-secondary")
  const copyrightName = COMPANY_NAME || SITE_NAME || ""

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm min-[1320px]:px-0 md:flex-row md:gap-12 md:px-4 dark:border-neutral-700">
        <div className="max-w-fit">
          <Link
            className="flex items-center gap-2 text-black md:pt-1 dark:text-white"
            href="/"
          >
            <LogoSquare size="sm" />
            <span className="font-mono uppercase">{SITE_NAME}</span>
          </Link>
        </div>
        <div className="flex gap-50">
          <div className="max-w-5">
            <p className="mb-2 font-semibold">Company</p>
            <Suspense fallback={<FooterSkeleton />}>
              <FooterMenu menu={menu} />
            </Suspense>
          </div>
          <div className="max-w-5">
            <p className="mb-2 font-semibold">Support</p>
            <Suspense fallback={<FooterSkeleton />}>
              <FooterMenu menu={menuSecondary} />
            </Suspense>
            <Link
              href="/blog"
              className={clsx(buttonVariants({ variant: "ghost" }))}
            >
              Blog
            </Link>
          </div>
        </div>
        <div className="mx-auto flex max-h-8 flex-row gap-4">
          <Link
            href="https://www.facebook.com/profile.php?id=61587149731996"
            className="cursor-pointer transition-all hover:scale-110"
            target="_blank"
            aria-label="Visit Vladyslav Petlia's Facebook profile"
          >
            <FaFacebookSquare className="size-8 text-[#1877f2] transition-all hover:opacity-80" />
          </Link>
          <Link
            href="https://github.com/VladyslavPetlia"
            className="cursor-pointer transition-all hover:scale-110"
            target="_blank"
            aria-label="Visit Vladyslav Petlia's GitHub profile"
          >
            <FaGithub className="size-8 text-black transition-all hover:opacity-80 dark:text-white" />
          </Link>
          <Link
            href="https://linkedin.com/in/vladyslav-petlia-245911418"
            className="cursor-pointer transition-all hover:scale-110"
            target="_blank"
            aria-label="Visit Vladyslav Petlia's LinkedIn profile"
          >
            <FaLinkedin className="size-8 text-[#0A66C2] transition-all hover:opacity-80" />
          </Link>
        </div>
        <div className="md:ml-auto">
          <a
            className="flex h-8 w-max flex-none items-center justify-center rounded-md border border-neutral-200 bg-white text-xs text-black dark:border-neutral-700 dark:bg-black dark:text-white"
            aria-label="Deploy on Vercel"
            href="https://vercel.com"
          >
            <span className="px-3">▲</span>
            <hr className="h-full border-r border-neutral-200 dark:border-neutral-700" />
            <span className="px-3">Deploy</span>
          </a>
        </div>
      </div>
      <Suspense fallback={<CopyrightSkeleton />}>
        <Copyright date={copyrightDate} name={copyrightName} />
      </Suspense>
    </footer>
  )
}

export function FooterSkeleton() {
  return (
    <div className="flex h-47 w-50 gap-2">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
    </div>
  )
}
