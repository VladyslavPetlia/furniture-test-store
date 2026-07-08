"use client"

import { useEffect } from "react"
import type { CustomerAccountProfile } from "@/lib/shopify/customer-account/types"
import { AccountProfile } from "./account-profule"
import { AccountSignIn } from "./account-sign-in"
import { LoaderIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type AccountSessionGateProps = {
  customer: CustomerAccountProfile | null
  needsRefresh: boolean
  error?: string | null
}

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-8 animate-spin", className)}
      {...props}
    />
  )
}

export function AccountSessionGate({
  customer,
  needsRefresh,
  error,
}: AccountSessionGateProps) {
  useEffect(() => {
    if (needsRefresh) {
      window.location.replace("/api/customer-auth/refresh")
    }
  }, [needsRefresh])

  if (needsRefresh) {
    return (
      <div className="bg-secondery mx-4 px-6 py-16 text-center sm:mx-6 lg:mx-8">
        <h1 className="text-2xl font-bold tracking-tight">Your account</h1>
        <p className="mt-2 text-sm">Signing you in...</p>
        <div className="mt-2 flex items-center justify-center">
          <Spinner />
        </div>
      </div>
    )
  }

  if (customer) {
    return <AccountProfile customer={customer} />
  }

  return <AccountSignIn error={error} />
}
