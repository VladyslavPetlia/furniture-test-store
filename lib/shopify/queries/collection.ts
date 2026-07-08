import productFragment from "../fragments/product"
import seoFragment from "../fragments/seo"

const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    image {
      url
      altText
      width
      height
    }
    seo {
      ...seo
    }
    updatedAt
  }
  ${seoFragment}
`

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      ...collection
    }
  }
  ${collectionFragment}
`

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          handle
          title
          description
          image {
            url
            altText
          }
          seo {
            title
            description
          }
          updatedAt
          # Fetch the first 10 products for each collection natively
          products(first: 10) {
            edges {
              node {
                # Add whatever product fields your Product type requires
                id
                handle
                title
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      products(sortKey: $sortKey, reverse: $reverse, first: 100) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`
