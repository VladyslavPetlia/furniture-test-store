import { cacheLife, cacheTag, revalidateTag } from "next/cache"
import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
} from "../constants"
import { isShopifyError } from "../type-guards"
import { ensureStartsWith } from "../utils"
import {
  Article,
  Cart,
  Collection,
  Connection,
  Image,
  InspirationCarouselItem,
  Menu,
  Page,
  Product,
  ShopifyAddToCartOperation,
  ShopifyBlogOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
} from "./types"
import { getMenuQuery } from "./queries/menu"
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
} from "./mutations/cart"
import { cookies, headers } from "next/headers"
import { getCartQuery } from "./queries/cart"
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
} from "./queries/collection"
import { getPageQuery, getPagesQuery } from "./queries/page"
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsWithFiltersAndSortQuery,
} from "./queries/product"
import { NextRequest, NextResponse } from "next/server"
import { getCarouselImagesQuery } from "./queries/inspiration-carousel"
import { getBlogListQuery, getBlogQuery } from "./queries/blog"

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : ""
const endpoint = domain ? `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}` : ""
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never

export async function shopifyFetch<T>({
  headers,
  query,
  variables,
}: {
  headers?: HeadersInit
  query: string
  variables?: ExtractVariables<T>
}): Promise<{ status: number; body: T } | never> {
  try {
    if (!endpoint) {
      throw new Error("SHOPIFY_STORE_DOMAIN environment variable is not set")
    }

    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
    })

    const body = await result.json()

    if (body.errors) {
      throw body.errors[0]
    }

    return {
      status: result.status,
      body,
    }
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || "unknown",
        status: e.status || 500,
        message: e.message,
        query,
      }
    }

    throw {
      error: e,
      query,
    }
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  // FIX: Prepend optional chaining to guard against an undefined connection payload
  return array?.edges?.map((edge) => edge?.node) || []
}

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: cart.cost.totalAmount.currencyCode,
    }
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
  }
}

// Adjust your ShopifyCollection type to accept products if using TypeScript definitions
const reshapeCollection = (collection: any): Collection | undefined => {
  if (!collection) return undefined

  return {
    ...collection,
    path: `/search/${collection.handle}`,
    // Unpack products natively if they exist in the response
    products: collection.products
      ? removeEdgesAndNodes(collection.products)
      : [],
  }
}

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = []

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection)

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection)
      }
    }
  }

  return reshapedCollections
}

const reshapeImages = (
  images: Connection<Image> | undefined,
  productTitle: string
) => {
  // FIX: Guard against missing images object connection blocks
  if (!images) return []
  const flattened = removeEdgesAndNodes(images)

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1]
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    }
  })
}

const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags?.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined
  }

  const { images, variants, ...rest } = product

  return {
    ...rest,
    // FIX: Fallback to an empty array map execution safely if nodes don't exist
    images: reshapeImages(images, product.title),
    variants: variants ? removeEdgesAndNodes(variants) : [],
  }
}

const reshapeProducts = (products: any[]) => {
  const reshapedProducts = []

  for (const product of products) {
    // FIX: Verify that the returned item actually contains product properties
    // before attempting to shape its data and pushing it to the UI grid
    if (product && (product.priceRange || product.title)) {
      const reshapedProduct = reshapeProduct(product)

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct)
      }
    }
  }

  return reshapedProducts
}

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
  })
  return reshapeCart(res.body.data.cartCreate.cart)
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  //  Fix: Safe runtime fallback value if the cookie doesn't exist
  const cartId = (await cookies()).get("cartId")?.value ?? ""
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines,
    },
  })
  return reshapeCart(res.body.data.cartLinesAdd.cart)
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  //  Fix: Safe runtime fallback value if the cookie doesn't exist
  const cartId = (await cookies()).get("cartId")?.value ?? ""
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds,
    },
  })

  return reshapeCart(res.body.data.cartLinesRemove.cart)
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  //  Fix: Safe runtime fallback value if the cookie doesn't exist
  const cartId = (await cookies()).get("cartId")?.value ?? ""
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines,
    },
  })

  return reshapeCart(res.body.data.cartLinesUpdate.cart)
}

export async function getCart(): Promise<Cart | undefined> {
  "use cache: private"
  cacheTag(TAGS.cart)
  cacheLife("seconds")

  const cartId = (await cookies()).get("cartId")?.value

  if (!cartId) {
    return undefined
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
  })

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined
  }

  return reshapeCart(res.body.data.cart)
}

export async function getCollection(
  handle: string
): Promise<Collection | undefined> {
  "use cache"
  cacheTag(TAGS.collections)
  cacheLife("days")

  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    variables: {
      handle,
    },
  })

  return reshapeCollection(res.body.data.collection)
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string
  reverse?: boolean
  sortKey?: string
}): Promise<Product[]> {
  "use cache"
  cacheTag(TAGS.collections, TAGS.products)
  cacheLife("days")

  if (!endpoint) {
    console.log(
      `Skipping getCollectionProducts for '${collection}' - Shopify not configured`
    )
    return []
  }

  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
    },
  })

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``)
    return []
  }

  return reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products))
}

export async function getCollections(): Promise<Collection[]> {
  "use cache"
  cacheTag(TAGS.collections)
  cacheLife("days")

  if (!endpoint) {
    console.log("Skipping getCollections - Shopify not configured")
    return [
      {
        handle: "",
        title: "All",
        description: "All products",
        image: null, // ✅ Added missing property
        products: [],
        seo: {
          title: "All",
          description: "All products",
        },
        path: "/search",
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
  })
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections)
  const collections = [
    {
      handle: "",
      title: "All",
      description: "All products",
      image: null, // ✅ Added missing property
      products: [],
      seo: {
        title: "All",
        description: "All products",
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith("hidden")
    ),
  ]

  return collections
}

export async function getMenu(handle: string): Promise<Menu[]> {
  "use cache"
  cacheTag(TAGS.collections)
  cacheLife("days")

  if (!endpoint) {
    console.log(`Skipping getMenu for '${handle}' - Shopify not configured`)
    return []
  }

  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    variables: {
      handle,
    },
  })

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url
        .replace(domain, "")
        .replace("/collections", "/search")
        .replace("/pages", ""),
    })) || []
  )
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle },
  })

  return res.body.data.pageByHandle
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
  })

  return removeEdgesAndNodes(res.body.data.pages)
}

export async function getBlogPost(
  blogHandle: string,
  articleHandle: string
): Promise<Article | undefined> {
  "use cache"
  cacheTag(TAGS.blog)
  cacheLife("days")

  const res = await shopifyFetch<ShopifyBlogOperation>({
    query: getBlogQuery,
    variables: {
      blogHandle,
      articleHandle,
    },
  })

  // Safe accessor syntax mapping down into your query schema structure
  return res.body.data?.blog?.articleByHandle ?? undefined
}

export async function getLatestArticles(
  blogHandle: string
): Promise<Article[]> {
  "use cache"
  cacheTag(TAGS.blog)
  cacheLife("hours")

  const res = await shopifyFetch<any>({
    query: getBlogListQuery,
    variables: { blogHandle },
  })

  const connection = res.body.data?.blog?.articles

  // Uses your project's custom utility array wrapper
  return connection ? removeEdgesAndNodes(connection) : []
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  "use cache"
  cacheTag(TAGS.products)
  cacheLife("days")

  if (!endpoint) {
    console.log(`Skipping getProduct for '${handle}' - Shopify not configured`)
    return undefined
  }

  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables: {
      handle,
    },
  })

  return reshapeProduct(res.body.data.product, false)
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  "use cache"
  cacheTag(TAGS.products)
  cacheLife("days")

  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    variables: {
      productId,
    },
  })

  return reshapeProducts(res.body.data.productRecommendations)
}

export async function getProducts({
  query,
  reverse,
  sortKey,
  filters,
}: {
  query: string
  reverse?: boolean
  sortKey?: string
  filters?: any[]
}): Promise<Product[]> {
  "use cache"
  cacheTag(TAGS.products)
  cacheLife("days")

  const activeQuery = query || ""

  let activeSortKey = sortKey
  if (sortKey === "CREATED_AT") activeSortKey = "LAST_MODIFIED"
  if (sortKey === "BEST_SELLING") activeSortKey = "RELEVANCE"

  interface ShopifySearchOperation {
    data: {
      search: Connection<any>
    }
    variables: {
      query: string
      reverse: boolean
      sortKey: string
      productFilters: any[] // FIX 1: Explicit interface parameter definition name update
    }
  }

  const res = await shopifyFetch<ShopifySearchOperation>({
    query: getProductsWithFiltersAndSortQuery,
    variables: {
      query: activeQuery,
      reverse: reverse ?? false,
      sortKey: activeSortKey ?? "RELEVANCE",
      productFilters: filters || [], // FIX 2: Swapped key name from 'filters' to 'productFilters'
    },
  })

  if (!res.body?.data?.search) return []

  return reshapeProducts(removeEdgesAndNodes(res.body.data.search))
}

interface ShopifyCarouselOperation {
  metaobjects: Connection<{
    id: string
    // MATCHED: Aligned exactly to your query's custom "image" alias
    image: {
      reference: {
        image?: Image
      } | null
    } | null
    // MATCHED: Aligned exactly to your query's custom "title" alias
    title: {
      value: string
    } | null
  }>
}

// Explicitly bind the type within your fetch block execution
export async function getCarouselImages(): Promise<InspirationCarouselItem[]> {
  "use cache"
  cacheTag(TAGS.products)
  cacheLife("days")

  try {
    const res = await shopifyFetch<{ data: ShopifyCarouselOperation }>({
      query: getCarouselImagesQuery,
    })

    if (!res.body?.data?.metaobjects) {
      return []
    }

    const nodes = removeEdgesAndNodes(res.body.data.metaobjects)

    return (
      nodes
        .map((node) => {
          // Safe tracking matches response keys
          const img = node.image?.reference?.image
          if (!img?.url) return null

          return {
            url: img.url,
            width: img.width,
            height: img.height,
            // Eliminates null values to satisfy string requirements
            altText: img.altText || node.title?.value || "Inspiration Look",
            titleField: node.title?.value || null,
          }
        })
        // Strips nulls completely with an explicit object predicate signature mapping
        .filter(
          (
            item
          ): item is {
            url: string
            width: number
            height: number
            altText: string
            titleField: string | null
          } => item !== null
        ) as InspirationCarouselItem[]
    )
  } catch (error) {
    console.error("Failed to fetch carousel images:", error)
    return []
  }
}

// File: lib/shopify/index.ts (or your centralized logic file)
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = [
    "collections/create",
    "collections/delete",
    "collections/update",
  ]
  const productWebhooks = [
    "products/create",
    "products/delete",
    "products/update",
  ]
  // ADDED: Metaobject payload registration array
  const metaobjectWebhooks = [
    "metaobjects/create",
    "metaobjects/update",
    "metaobjects/delete",
  ]

  const topic = (await headers()).get("x-shopify-topic") || "unknown"
  const secret = req.nextUrl.searchParams.get("secret")
  const isCollectionUpdate = collectionWebhooks.includes(topic)
  const isProductUpdate = productWebhooks.includes(topic)
  // ADDED: Evaluation boolean condition configuration
  const isMetaobjectUpdate = metaobjectWebhooks.includes(topic)

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error("Invalid revalidation secret.")
    return NextResponse.json({ status: 401 })
  }

  // UPDATED: Guard statement checks for metaobjects now
  if (!isCollectionUpdate && !isProductUpdate && !isMetaobjectUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 })
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections, "seconds")
  }

  // UPDATED: Product hooks or Metaobject look modifications trigger product cache clearout
  if (isProductUpdate || isMetaobjectUpdate) {
    revalidateTag(TAGS.products, "seconds")
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() })
}
