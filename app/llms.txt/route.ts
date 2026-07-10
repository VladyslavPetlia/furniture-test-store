import { getCollections, getPages, getProducts } from "@/lib/shopify"
import { baseUrl, validateEnvironmentVariables } from "@/lib/utils"

export async function GET() {
  validateEnvironmentVariables()

  // 1. Fetch live paths from Shopify
  const collectionsPromise = getCollections().catch(() => [])
  const productsPromise = getProducts({ query: "" }).catch(() => [])
  const pagesPromise = getPages().catch(() => [])

  const [collections, products, pages] = await Promise.all([
    collectionsPromise,
    productsPromise,
    pagesPromise,
  ])

  // 2. Draft valid Markdown format
  let markdown = `# Your Store Name\n\n`
  markdown += `> An optimized e-commerce storefront powered by Shopify, featuring premium products, collections, and storefront pages.\n\n`

  // 3. Append Store Pages
  markdown += `## Core Pages\n\n`
  markdown += `- [Home Page](${baseUrl}): The primary landing storefront.\n`
  pages.forEach((page) => {
    markdown += `- [${page.title}](${baseUrl}/${page.handle}): Store information page.\n`
  })

  // 4. Append Collections
  if (collections.length > 0) {
    markdown += `\n## Product Collections\n\n`
    collections.forEach((collection) => {
      markdown += `- [${collection.title}](${baseUrl}${collection.path}): Curated collection catalog.\n`
    })
  }

  // 5. Append Products
  if (products.length > 0) {
    markdown += `\n## Available Products\n\n`
    products.forEach((product) => {
      markdown += `- [${product.title}](${baseUrl}/product/${product.handle}): Direct-to-consumer inventory item.\n`
    })
  }

  // 6. Return response explicitly typed as raw text
  return new Response(markdown, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, must-revalidate", // Guarantees live dynamic fetches without compiler configs
    },
  })
}
