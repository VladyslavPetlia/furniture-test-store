import clsx from "clsx"
import { ShoppingCart } from "lucide-react"

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string
  quantity?: number
}) {
  return (
    <div>
      <ShoppingCart
        className={clsx(
          "h-4 transition-all ease-in-out hover:scale-110",
          className
        )}
      />
      <span className="sr-only">Open shopping cart drawer</span>
      {quantity ? (
        <div className="absolute top-0 right-0 -mt-2 -mr-2 h-4 w-4 rounded-sm bg-primary text-[11px] font-medium text-white">
          {quantity}
        </div>
      ) : null}
    </div>
  )
}
