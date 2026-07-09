import { Button } from "@/components/ui/button"
import LoadingDots from "../loading-dots"
import { useFormStatus } from "react-dom"

export function CheckoutButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      className="cursor-pointer px-8 py-6 text-lg"
      variant="default"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-white" /> : "Proceed to Checkout"}
    </Button>
  )
}
