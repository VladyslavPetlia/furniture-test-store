export const getBlogQuery = /* GraphQL */ `
  query getSinglePost($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        excerpt
        image {
          url
          altText
        }
        authorV2 {
          name
        }
      }
    }
  }
`

export const getBlogListQuery = /* GraphQL */ `
  query getArticlesList($blogHandle: String!) {
    blog(handle: $blogHandle) {
      articles(first: 6) {
        edges {
          node {
            title
            handle
            excerpt
            publishedAt
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`
