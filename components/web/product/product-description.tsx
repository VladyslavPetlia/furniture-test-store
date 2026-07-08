import { Product } from "@/lib/shopify/types"
import { use } from "react"
import { VariantSelector } from "./variant-selector" // Adjust import paths to match your file structure
import { AddToCart } from "@/components/web/cart/add-to-cart"
import { getSelectedVariant } from "@/lib/utils"

export function ProductDescription({
  product,
  searchParams,
}: {
  product: Product
  searchParams: Promise<any>
}) {
  const resolvedParams = use(searchParams) || {}

  // 1. Locate the active variant matching the user's clicks
  const selectedVariant = getSelectedVariant(product, resolvedParams)

  // 2. Fall back to minimum pricing options if options are unselected
  const priceAmount = selectedVariant
    ? selectedVariant.price.amount
    : product.priceRange.minVariantPrice.amount

  const currencyCode = selectedVariant
    ? selectedVariant.price.currencyCode
    : product.priceRange.minVariantPrice.currencyCode

  return (
    <div className="space-y-6">
      {/* Product Title and Info */}
      <div className="flex flex-col border-b border-neutral-200 pb-4 dark:border-neutral-800">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
          {product.title}
        </h1>

        {/* Dynamic Price Badge */}
        <div className="mt-3 w-fit bg-primary px-3 py-1.5 text-sm font-semibold text-white">
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currencyCode,
            }).format(parseFloat(priceAmount))}
          </span>
          {!selectedVariant && product.variants.length > 1 && (
            <span className="ml-1 text-xs text-blue-200">(Starting price)</span>
          )}
        </div>
      </div>

      {/* 3. DYNAMIC VARIANT SELECTORS (Sizes, Colors, Materials) */}
      <VariantSelector options={product.options} variants={product.variants} />

      {/* Product Text Description Block */}
      {product.descriptionHtml ? (
        <div
          className="prose prose-sm text-neutral-600 dark:text-neutral-400 dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      ) : (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {product.description}
        </p>
      )}

      {/* 4. ADD TO CART ACTION ZONE */}
      <div className="pt-4">
        <AddToCart product={product} />
      </div>
    </div>
  )
}
