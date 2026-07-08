"use client"

import { useState } from "react"

interface FaqItem {
  question: string
  answer: string
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="mx-auto mb-8 max-w-4xl space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={index}
            className="border-b border-neutral-200 pb-4 dark:border-neutral-800"
          >
            <button
              className="flex w-full items-center justify-between py-4 text-left text-xl font-semibold transition-colors hover:text-neutral-600 dark:hover:text-neutral-400"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              {/* This safely injects inline HTML formatted text inside questions if any */}
              <span dangerouslySetInnerHTML={{ __html: faq.question }} />
              <span className="ml-4 text-2xl font-light text-neutral-400">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            <div
              className={`grid transition-all duration-200 ease-in-out ${
                isOpen
                  ? "mt-2 grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p
                  className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
