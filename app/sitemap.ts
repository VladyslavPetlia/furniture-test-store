import { getCollections, getPages, getProducts } from "@/lib/shopify"
import { getSiteUrl } from "@/lib/site-url"
import { validateEnvironmentVariables } from "@/lib/utils"
import { MetadataRoute } from "next"

type Route = {
  url: string
  lastModified: string
}

export const revalidate = 3600 // Revalidates the sitemap cache every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables()
  const baseUrl = getSiteUrl()

  // 1. Static Base Routes
  const routesMap = [""].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }))

  // 2. Dynamic Collections
  const collectionsPromise = getCollections().then((collections) =>
    collections.map((collection) => ({
      url: `${baseUrl}${collection.path}`, // Safely uses Shopify's path
      lastModified: collection.updatedAt,
    }))
  )

  // 3. Dynamic Products
  const productsPromise = getProducts({ query: "" }).then((products) =>
    products.map((product) => ({
      url: `${baseUrl}/product/${product.handle}`,
      lastModified: product.updatedAt,
    }))
  )

  // 4. Dynamic Pages (FIXED: Ensure this matches your /[page] or /pages/[handle] route layout)
  const pagesPromise = getPages().then((pages) =>
    pages.map((page) => ({
      url: `${baseUrl}/${page.handle}`, // Ensure this aligns with your actual folder structure
      lastModified: page.updatedAt,
    }))
  )

  try {
    const fetchedRoutes = (
      await Promise.all([collectionsPromise, productsPromise, pagesPromise])
    ).flat()

    return [...routesMap, ...fetchedRoutes]
  } catch (error: any) {
    // Check if the error is just Next.js intentionally cutting off the build worker fetch
    const isNextPrerenderAbort = error?.message?.includes(
      "During prerendering, fetch() rejects"
    )

    if (!isNextPrerenderAbort) {
      console.error("Failed to generate sitemap:", error)
    }

    return routesMap // Fallback gracefully to just the homepage if the API fails
  }
}
