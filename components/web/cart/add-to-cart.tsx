"use client"

import clsx from "clsx"
import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { Product, ProductVariant } from "@/lib/shopify/types"
import { addItem } from "./actions"
import { useCart } from "./cart-context"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean
  selectedVariantId: string | undefined
}) {
  if (!availableForSale) {
    return (
      <Button
        disabled
        variant="destructive"
        className="relative flex w-full py-8"
      >
        Out Of Stock
      </Button>
    )
  }

  if (!selectedVariantId) {
    return (
      <Button
        aria-label="Please select an option"
        disabled
        variant="destructive"
        className="relative flex w-full py-8"
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </Button>
    )
  }

  return (
    <Button
      aria-label="Add to cart"
      variant="default"
      className={clsx(
        "relative flex w-full cursor-pointer py-8 transition duration-300 ease-in-out",
        {
          "hover:opacity-90": true,
        }
      )}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Add To Cart
    </Button>
  )
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product
  const { addCartItem } = useCart()
  const searchParams = useSearchParams()
  const [message, formAction] = useActionState(addItem, null)

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase())
    )
  )
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined
  const selectedVariantId = variant?.id || defaultVariantId
  const addItemAction = formAction.bind(null, selectedVariantId)
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  )!

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product)
        addItemAction()
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  )
}
