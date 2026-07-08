import { clsx, type ClassValue } from "clsx"
import { ReadonlyURLSearchParams } from "next/navigation"
import { twMerge } from "tailwind-merge"
import type { Money, Product, ProductVariant } from "@/lib/shopify/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/////////////////////////

export const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000"

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString()
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`

  return `${pathname}${queryString}`
}

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    "SHOPIFY_STORE_DOMAIN",
    "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  ]
  const missingEnvironmentVariables = [] as string[]

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar)
    }
  })

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        "\n"
      )}\n`
    )
  }

  if (
    process.env.SHOPIFY_STORE_DOMAIN?.includes("[") ||
    process.env.SHOPIFY_STORE_DOMAIN?.includes("]")
  ) {
    throw new Error(
      "Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them."
    )
  }
}

export function formatMoney(money: Money): string {
  const amount = parseFloat(money.amount)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(amount)
}

export function getSelectedVariant(
  product: Product,
  searchParams: Record<string, string | string[] | undefined>
): ProductVariant | undefined {
  return product.variants.find((variant) =>
    variant.selectedOptions.every((option) => {
      const selectedValue = searchParams[option.name.toLowerCase()]
      return selectedValue === option.value
    })
  )
}
