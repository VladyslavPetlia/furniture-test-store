import CollectionsCarousel from "@/components/web/collections-carousel/collections-carousel"
import Hero from "@/components/web/hero-image"
import Footer from "@/components/web/layout/footer"
import { Suspense } from "react"
import { InspirationCarousel } from "@/components/web/inspiration-carousel"
import { HomepageGrid } from "@/components/web/homepage-grid"
import Grid from "@/components/web/grid"
import Link from "next/link"
import clsx from "clsx"
import { buttonVariants } from "@/components/ui/button"
import HeroSkeleton from "@/components/web/skeletons/hero-skeleton"
import FilterCarouselListSkeleton from "@/components/web/skeletons/collections-carousel-skeleton"
import InspirationCarouselSkeleton from "@/components/web/skeletons/insperation-carousel-skeleton"
import HomepageGridSkeleton from "@/components/web/skeletons/homepage-grid-skeleton"
import MainButton from "@/components/web/main-button"

export const metadata = {
  description:
    "High-performance ecommerce store built with Next.js, Vercel, and Shopify.",
  openGraph: {
    type: "website",
  },
}

export default function Home() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>
      <Suspense
        fallback={<FilterCarouselListSkeleton title="Our Collections" />}
      >
        <div style={{ contain: "layout paint" }}>
          <CollectionsCarousel />
        </div>
      </Suspense>
      <Suspense fallback={<InspirationCarouselSkeleton />}>
        <div style={{ contain: "layout paint" }}>
          <InspirationCarousel />
        </div>
      </Suspense>
      <Suspense fallback={<HomepageGridSkeleton />}>
        <h3 className="mt-10 text-center font-mono text-4xl text-black md:block dark:text-white">
          Our Products
        </h3>
        <Grid className="mx-auto mt-10 mb-10 max-w-7xl grid-cols-1 px-5 sm:grid-cols-2 lg:grid-cols-4">
          <HomepageGrid />
        </Grid>
        <div className="mb-25 flex items-center justify-center">
          <MainButton text="See More" />
        </div>
      </Suspense>

      <Footer />
    </>
  )
}
