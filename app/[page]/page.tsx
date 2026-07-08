import Prose from "@/components/web/prose"
import { getPage } from "@/lib/shopify"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
// 1. Import your interactive client component (created in the next step)
import FaqAccordion from "@/components/web/faq-accordion"

export async function generateMetadata(props: {
  params: Promise<{ page: string }>
}): Promise<Metadata> {
  const params = await props.params
  const page = await getPage(params.page)

  // Fix the empty conditional block from the original code
  if (!page) return notFound()

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: "article",
    },
  }
}

// 2. Add an HTML parsing helper to split standard Shopify H3 and P tags into JSON
function parseFaqHtml(htmlString: string) {
  const faqs: { question: string; answer: string }[] = []
  // Matches <h3>Question</h3> followed by <p>Answer</p>
  const regex = /<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>/g
  let match

  while ((match = regex.exec(htmlString)) !== null) {
    faqs.push({ question: match[1], answer: match[2] })
  }
  return faqs
}

export default async function Page(props: {
  params: Promise<{ page: string }>
}) {
  const params = await props.params
  const page = await getPage(params.page)

  if (!page) return notFound()

  // 3. Check if the current page handle is 'faq'
  const isFaqPage = params.page === "faq"
  const parsedFaqs = isFaqPage ? parseFaqHtml(page.body) : []

  // 4. Generate structured JSON-LD data for Google FAQ snippets
  const jsonLd = isFaqPage
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: parsedFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null

  return (
    <>
      {/* Inject SEO Structured Data if it's the FAQ page */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>

      {/* 5. Conditionally switch UI layouts based on the page handle */}
      {isFaqPage && parsedFaqs.length > 0 ? (
        <FaqAccordion faqs={parsedFaqs} />
      ) : (
        <Prose className="mb-8" html={page.body} />
      )}

      <p className="mt-8 text-sm italic">
        {`This document was last updated on ${new Intl.DateTimeFormat(
          undefined,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        ).format(new Date(page.updatedAt))}.`}
      </p>
    </>
  )
}
