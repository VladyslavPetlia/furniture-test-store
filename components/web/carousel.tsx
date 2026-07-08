import Link from "next/link"
import { GridTileImage } from "./grid/tile"
import { getCollectionProducts } from "@/lib/shopify"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"

export async function CarouselMain() {
  // Collections that start with `hidden-*` are hidden from the search page.
  const products = await getCollectionProducts({
    collection: "hidden-homepage-carousel",
  })

  if (!products?.length) return null

  return (
    <div
      className="w-full overflow-hidden pt-1 pb-6"
      style={{ contain: "layout paint" }}
    >
      <Carousel className="mx-auto w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
        <CarouselContent className="-ml-4">
          {products.map((product, i) => (
            <CarouselItem
              key={`${product.handle}${i}`}
              className="basis-1/1 pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/5"
            >
              <div className="p-1">
                <Link
                  href={`/product/${product.handle}`}
                  className="relative block aspect-3/4 h-full w-full"
                >
                  <GridTileImage
                    alt={product.title}
                    label={{
                      title: product.title,
                      amount: product.priceRange.maxVariantPrice.amount,
                      currencyCode:
                        product.priceRange.maxVariantPrice.currencyCode,
                    }}
                    src={product.featuredImage?.url}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  />
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="translate-y-0" />
        <CarouselNext className="translate-y-0" />
      </Carousel>
    </div>
  )
}
