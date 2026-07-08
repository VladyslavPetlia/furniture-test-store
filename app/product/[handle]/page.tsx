import { GridTileImage } from "@/components/web/grid/tile"
import Footer from "@/components/web/layout/footer"
import { Gallery } from "@/components/web/product/gallery"
import { ProductDescription } from "@/components/web/product/product-description"
import { ProductPageSkeleton } from "@/components/web/skeletons/product-page-skeleton"
import { HIDDEN_PRODUCT_TAG } from "@/lib/constants"
import { getProduct, getProductRecommendations } from "@/lib/shopify"
import { Image, Product, ProductVariant } from "@/lib/shopify/types"
import { getSelectedVariant } from "@/lib/utils"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense, use } from "react"

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const params = await props.params
  const product = await getProduct(params.handle)

  if (!product) return notFound()

  const { url, width, height, altText: alt } = product.featuredImage || {}
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG)

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [{ url, width, height, alt }],
        }
      : null,
  }
}

// 1. DO NOT await params here. Pass the promise directly down.
export default function ProductPage(props: {
  params: Promise<{ handle: string }>
  searchParams: Promise<any>
}) {
  return (
    <>
      <Suspense fallback={<ProductPageSkeleton />}>
        {/* Pass both promises into your content streamer */}
        <ProductPageContent
          paramsPromise={props.params}
          searchParamsPromise={props.searchParams}
        />
      </Suspense>
      <Footer />
    </>
  )
}

// 2. Await the promise INSIDE this component, which is safely wrapped in Suspense
async function ProductPageContent({
  paramsPromise,
  searchParamsPromise,
}: {
  paramsPromise: Promise<{ handle: string }>
  searchParamsPromise: Promise<any>
}) {
  const params = await paramsPromise
  const product = await getProduct(params.handle)
  const resolvedParams = (await searchParamsPromise) || {}

  if (!product) return notFound()

  // 1. Filter out empty URL values to see exactly what the user has clicked so far
  const activeSelections = Object.entries(resolvedParams).filter(
    ([_, val]) => typeof val === "string" && val !== ""
  ) as [string, string][]

  // 2. Find the best variant that matches the clicked options AND has an image
  let bestImageVariant = null
  let maxMatchedOptions = -1

  for (const variant of product.variants) {
    if (!variant.image?.url) continue // Skip variants with no image

    let currentMatches = 0
    let isCompatible = true

    // Check how many of the user's active selections this variant satisfies
    for (const [key, value] of activeSelections) {
      const match = variant.selectedOptions.find(
        (opt) => opt.name.toLowerCase() === key.toLowerCase()
      )

      if (match) {
        if (match.value === value) {
          currentMatches++ // It's a match!
        } else {
          isCompatible = false // Conflict found (e.g., user selected 'Red' but variant is 'Blue')
          break
        }
      }
    }

    // If this variant is compatible and matches more choices than our previous best, save it
    if (isCompatible && currentMatches > maxMatchedOptions) {
      maxMatchedOptions = currentMatches
      bestImageVariant = variant
    }
  }

  // 3. Prepare the standard gallery image array
  let galleryImages = product.images.slice(0, 5).map((image: any) => ({
    src: image.url,
    altText: image.altText,
  }))

  // 4. If we found a valid partial or full match with an image, pull it to the front
  if (bestImageVariant?.image?.url) {
    const variantImage = {
      src: bestImageVariant.image.url,
      altText: bestImageVariant.image.altText || product.title,
    }

    galleryImages = [
      variantImage,
      ...galleryImages.filter((img) => img.src !== variantImage.src),
    ]
  }

  return (
    <>
      {/* ... keeping JSON-LD script the same ... */}
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4">
        <div className="flex flex-col border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          {/* Main Gallery Column */}
          <div className="relative h-full min-h-100 w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-137.5 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900" />
              }
            >
              <Gallery
                key={bestImageVariant?.id || "default"}
                images={galleryImages}
              />
            </Suspense>
          </div>

          <div className="basis-full lg:basis-2/6">
            <Suspense fallback={null}>
              <ProductDescription
                product={product}
                searchParams={searchParamsPromise}
              />
            </Suspense>
          </div>
        </div>
        <RelatedProducts id={product.id} />
      </div>
    </>
  )
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id)
  if (!relatedProducts.length) return null

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto p-1">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link
              className="relative flex aspect-3/4 h-full w-full"
              href={`/product/${product.handle}`}
              prefetch={true}
            >
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.minVariantPrice.amount,
                  currencyCode: product.priceRange.minVariantPrice.currencyCode,
                }}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
