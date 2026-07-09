import { Skeleton } from "@/components/ui/skeleton"
import { getBlogPost } from "@/lib/shopify"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Suspense } from "react"

interface Props {
  params: Promise<{
    blogHandle: string
    articleHandle: string
  }>
}

// 1. Structural Page Wrapper (Executes instantly without blocking)
export default function BlogPostPage({ params }: Props) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {/* Provides a clear loading state while dynamic parameters load */}
      <Suspense fallback={<Skeleton className="h-100 w-full" />}>
        <PostDetails params={params} />
      </Suspense>
    </main>
  )
}

// 2. Data Fetching Component (Safely isolated inside Suspense)
async function PostDetails({ params }: { params: Props["params"] }) {
  // Awaiting the params promise inside a Suspense container satisfies the Next.js runtime compiler
  const { blogHandle, articleHandle } = await params
  const post = await getBlogPost(blogHandle, articleHandle)

  if (!post) {
    notFound()
  }

  return (
    <article>
      {/* Featured Image - Uses your canonical layout h-100 class */}
      {post.image && (
        <div className="relative mb-6 h-100 w-full">
          <Image
            src={post.image.url}
            alt={post.image.altText || post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Meta Details */}
      <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-100">
        {post.title}
      </h1>
      <div className="mb-8 text-sm text-neutral-500">
        By {post.authorV2?.name} •{" "}
        {new Date(post.publishedAt).toLocaleDateString()}
      </div>

      {/* HTML Content Body */}
      <div
        className="mx-auto prose max-w-6xl text-base leading-7 text-black dark:text-white prose-headings:mt-8 prose-headings:font-semibold prose-headings:tracking-wide prose-headings:text-black dark:prose-headings:text-white prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg prose-a:text-black prose-a:underline prose-a:hover:text-neutral-300 dark:prose-a:text-white prose-strong:text-black dark:prose-strong:text-white prose-ol:mt-8 prose-ol:list-decimal prose-ol:pl-6 prose-ul:mt-8 prose-ul:list-disc prose-ul:pl-6"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  )
}
