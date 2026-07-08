import { getCollections } from "@/lib/shopify"
import FilterCarouselList from "."

async function CollectionList() {
  const allCollections = await getCollections()

  const filteredCollections = allCollections
    .filter((collection) => collection.title.toLowerCase() !== "all")
    .map((collection) => ({
      title: collection.title,
      handle: collection.handle,
      path: collection.path,
      // Fallback to the collection image, then the first product image, then the asset placeholder
      image:
        collection.image?.url ||
        collection.products?.[0]?.featuredImage?.url ||
        "/imageExample.png",
      products: collection.products || [], // Passed directly down
    }))

  return <FilterCarouselList list={filteredCollections} />
}

export default function CollectionsCarousel() {
  return <CollectionList />
}
