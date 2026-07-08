"use client"

import { CartItem } from "@/lib/shopify/types"
import clsx from "clsx"
import { useActionState } from "react"
import { updateItemQuantity } from "./actions"
import { MinusIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

function SubmitButton({ type }: { type: "plus" | "minus" }) {
  return (
    <Button
      size="icon-sm"
      variant="ghost"
      type="submit"
      //  Fix 1: The explicit aria-label attribute must be cleanly passed to the button
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={clsx("cursor-pointer hover:border-primary hover:opacity-80", {
        "ml-auto": type === "minus",
      })}
    >
      {type === "plus" ? (
        //  Fix 2: Remove the nested <span> blocks to prevent Shadcn layout overrides
        <PlusIcon className="h-4 w-4 dark:text-neutral-200" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-200" />
      )}
    </Button>
  )
}

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
}: {
  item: CartItem
  type: "plus" | "minus"
  //  Fix: Define the strict function signature accepting "plus" or "minus"
  optimisticUpdate: (id: string, action: "plus" | "minus") => void
}) {
  const [message, formAction] = useActionState(updateItemQuantity, null)
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  }
  const updateItemQuantityAction = formAction.bind(null, payload)

  return (
    <form
      action={async () => {
        optimisticUpdate(payload.merchandiseId, type)
        updateItemQuantityAction()
      }}
    >
      <SubmitButton type={type} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  )
}
