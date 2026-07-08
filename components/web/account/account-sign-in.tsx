import { Button } from "@/components/ui/button"
import { getCustomerAccountLoginPath } from "@/lib/shopify/customer-account/config"
import Link from "next/link"

const ERROR_MESSAGES: Record<string, string> = {
  auth_redirect:
    "Customer sign-in requires an HTTPS public URL. Set NEXT_PUBLIC_SITE_URL to your production domain (for example https://rokn-jade.vercel.app) in Vercel environment variables, and register the same callback URL in Shopify admin.",
  redirect_uri:
    "The callback URL in Shopify admin does not match this app. Register your HTTPS callback URL under Headless > Customer Account API > Application setup.",
  login_failed: "We couldn't complete sign-in. Please try again.",
  missing_code: "Sign-in was interrupted. Please try again.",
  session_expired: "Your session expired. Please sign in again.",
}

type AccountSignInProps = {
  error?: string | null
}

export function AccountSignIn({ error }: AccountSignInProps) {
  const errorMessage = error
    ? (ERROR_MESSAGES[error] ?? "We couldn't sign you in. Please try again.")
    : null

  return (
    <div className="mx-4 bg-secondary px-6 py-16 text-center sm:mx-6 lg:mx-8">
      <h1 className="text-2xl font-bold tracking-tight">Your account</h1>
      <p className="mt-2 mb-2 text-sm">
        Sign in to view your profile and order history.
      </p>

      {errorMessage && (
        <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
      )}

      <Link href={getCustomerAccountLoginPath()} className="mt-6">
        <Button className="cursor-pointer">Sign in</Button>
      </Link>
    </div>
  )
}
