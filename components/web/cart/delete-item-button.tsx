"use client"

import { CartItem } from "@/lib/shopify/types"
import { useActionState } from "react"
import { removeItem } from "./actions"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem
  //  Fix: Define the exact function signature instead of using 'any'
  optimisticUpdate: (id: string, action: "delete") => void
}) {
  const [message, formAction] = useActionState(removeItem, null)
  const merchandiseId = item.merchandise.id
  const removeItemAction = formAction.bind(null, merchandiseId)

  return (
    <form
      action={async () => {
        optimisticUpdate(merchandiseId, "delete")
        removeItemAction()
      }}
    >
      <Button
        type="submit"
        aria-label="Remove cart item"
        className="ml-1 size-6 cursor-pointer ring-1 ring-transparent hover:ring-primary"
      >
        <X className="mx-px h-4 w-4 text-white dark:text-black" />
        <span className="sr-only">Remove cart item</span>
      </Button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  )
}
