export type SortFilterItem = {
  title: string
  slug: string | null
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE"
  reverse: boolean
}

export const defaultSort: SortFilterItem = {
  title: "Relevance",
  slug: null,
  sortKey: "RELEVANCE",
  reverse: false,
}

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Trending",
    slug: "trending-desc",
    sortKey: "BEST_SELLING",
    reverse: false,
  }, // asc
  {
    title: "Latest arrivals",
    slug: "latest-desc",
    sortKey: "CREATED_AT",
    reverse: true,
  },
  {
    title: "Low to high",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  }, // asc
  {
    title: "High to low",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
]

export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
  blog: "blog",
}

export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden"
export const DEFAULT_OPTION = "Default Title"
export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2026-04/graphql.json"

export const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN ?? ""
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? ""
export const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2026-04"

export function isShopifyConfigured(): boolean {
  return Boolean(SHOPIFY_STORE_DOMAIN && SHOPIFY_STOREFRONT_ACCESS_TOKEN)
}
