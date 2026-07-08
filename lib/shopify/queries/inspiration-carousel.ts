export const getCarouselImagesQuery = `
  query GetInspirationCarousel {
  metaobjects(type: "inspiration_carousel_item", first: 10) {
    edges {
      node {
        id
        # Fetching your custom file field structure
        image: field(key: "carousel_image") {
          reference {
            ... on MediaImage {
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
        # Fetching your optional overlay title field structure
        title: field(key: "slide_title") {
          value
        }
      }
    }
  }
}
`
