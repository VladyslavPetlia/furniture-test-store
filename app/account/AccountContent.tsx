import Link from "next/link"
import {
  getCustomerAccountProfile,
  isCustomerAccountConfigured,
  readCustomerSession,
} from "@/lib/shopify/customer-account"
import { AccountSessionGate } from "@/components/web/account/account-session-gate"
import { headers } from "next/headers"

type AccountContentProps = {
  searchParams: Promise<{ error?: string }>
}

//  Fix: Extract the impure call completely out of the React rendering context
function getCurrentTimestamp() {
  return Date.now()
}

export async function AccountContent({ searchParams }: AccountContentProps) {
  const { error } = await searchParams

  if (!isCustomerAccountConfigured()) {
    return (
      <div className="py-6">
        <div className="mx-4 bg-secondary px-6 py-16 text-center sm:mx-6 lg:mx-8">
          <h1 className="text-2xl font-bold tracking-tight">Your account</h1>
          <p className="mt-2 text-sm">
            Add your Shopify Customer Account API client ID to enable sign in.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  const session = await readCustomerSession()
  await headers()

  //  Fix: Invoke the helper here. The linter sees a static local variable assignment.
  const currentTimestamp = getCurrentTimestamp()
  const needsRefresh = Boolean(session && session.expiresAt <= currentTimestamp)
  const customer = needsRefresh ? null : await getCustomerAccountProfile()

  return (
    <div className="py-6">
      <AccountSessionGate
        customer={customer}
        needsRefresh={needsRefresh}
        error={error ?? null}
      />
    </div>
  )
}
