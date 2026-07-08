import productFragment from "../fragments/product"

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`

export const getProductsWithFiltersAndSortQuery = /* GraphQL */ `
  query searchProducts(
    $query: String!
    $sortKey: SearchSortKeys
    $reverse: Boolean
    $productFilters: [ProductFilter!]
  ) {
    search(
      query: $query
      sortKey: $sortKey
      reverse: $reverse
      productFilters: $productFilters
      first: 100
    ) {
      productFilters {
        id
        label
        type
        values {
          id
          label
          count
        }
      }
      edges {
        node {
          ... on Product {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${productFragment}
`
