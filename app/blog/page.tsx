import { getLatestArticles } from "@/lib/shopify"
import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import clsx from "clsx"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Our Blog",
  description: "Read our latest news and updates.",
}

async function BlogFeed() {
  const blogHandle = "news" // Ensure this matches your Shopify blog category handle
  const articles = await getLatestArticles(blogHandle)

  if (!articles || articles.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-neutral-500">No blog posts found.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <article
          key={article.handle}
          className="flex flex-col overflow-hidden bg-[#46edd5]"
        >
          {article.image && (
            <div className="relative h-48 w-full bg-[#46edd5]">
              <Image
                src={article.image.url}
                alt={article.image.altText || article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col p-5">
            <h2 className="mb-2 text-xl font-semibold text-black">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="mb-4 text-sm text-neutral-700">{article.excerpt}</p>
            )}
            <Link
              href={`/blog/${blogHandle}/${article.handle}`}
              className={clsx(buttonVariants({ variant: "default" }), "py-5")}
            >
              <div className="text-lg">Read Post &rarr;</div>
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <h1 className="mb-10 text-4xl font-bold tracking-tight text-black dark:text-neutral-100">
        Our Blog
      </h1>
      <Suspense fallback={<Skeleton className="h-100 w-full" />}>
        <BlogFeed />
      </Suspense>
    </main>
  )
}
