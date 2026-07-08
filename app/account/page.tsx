import type { Metadata } from "next"
import { Suspense } from "react"
import { AccountContent } from "./AccountContent"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Account",
  robots: {
    index: false, // Keeps internal search and user accounts hidden from Google
    follow: true,
  },
}

type AccountPageProps = {
  searchParams: Promise<{ error?: string }>
}

export default function AccountPage({ searchParams }: AccountPageProps) {
  return (
    <Suspense fallback={<Skeleton className="m-10 h-60" />}>
      <AccountContent searchParams={searchParams} />
    </Suspense>
  )
}
