import CollectionsCarousel from "@/components/web/collections-carousel/collections-carousel"
import Hero from "@/components/web/hero-image"
import Footer from "@/components/web/layout/footer"
import { Suspense } from "react"
import { FilterCarouselListSkeleton } from "@/components/web/skeletons/collections-carousel-skeleton"
import { HeroSkeleton } from "@/components/web/skeletons/hero-skeleton"
import { InspirationCarousel } from "@/components/web/inspiration-carousel"
import { HomepageGrid } from "@/components/web/homepage-grid"
import Grid from "@/components/web/grid"

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
      <Suspense fallback={<FilterCarouselListSkeleton hasTitle={true} />}>
        <div style={{ contain: "layout paint" }}>
          <CollectionsCarousel />
        </div>
      </Suspense>
      <Suspense>
        <InspirationCarousel />
      </Suspense>
      <Suspense>
        <Grid className="mx-auto mt-40 mb-40 max-w-7xl grid-cols-1 px-5 sm:grid-cols-2 lg:grid-cols-4">
          <HomepageGrid />
        </Grid>
      </Suspense>

      <Footer />
    </>
  )
}
