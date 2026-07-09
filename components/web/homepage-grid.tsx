import { getCollectionProducts } from "@/lib/shopify"
import Grid from "./grid"
import Link from "next/link"
import { GridTileImage } from "./grid/tile"

export async function HomepageGrid() {
  const products = await getCollectionProducts({
    collection: "hidden-homepage-grid",
  })

  if (!products?.length) return null

  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.handle} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            href={`/product/${product.handle}`}
            prefetch={true}
          >
            <GridTileImage
              alt={product.title}
              // className="object-cover transition-all hover:scale-110"
              label={{
                title: product.title,
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode,
              }}
              src={product.featuredImage?.url}
              fill
              quality={70}
              sizes="(min-width: 1280px) 300px, (min-width: 1024px) 33vw, (min-width: 768px) 430px, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  )
}
