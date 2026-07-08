import Image from "next/image"
import type { CustomerAccountProfile } from "@/lib/shopify/customer-account/types"
import { Price } from "../acount-price"
import { shopifyImageUrl } from "@/lib/shopify/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type AccountProfileProps = {
  customer: CustomerAccountProfile
}

function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export function AccountProfile({ customer }: AccountProfileProps) {
  const orders = customer.orders.edges.map((edge) => edge.node)
  const email = customer.emailAddress?.emailAddress

  return (
    <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-3xl lg:px-8">
      <div className="bg-secondary p-5">
        <h1 className="text-2xl font-bold tracking-tight">Your account</h1>
        <p className="mt-1 text-sm">{customer.displayName}</p>
        {email && <p className="mt-1 text-sm">{email}</p>}

        <form action="/api/customer-auth/logout" method="post" className="mt-5">
          <Button
            type="submit"
            variant="outline"
            className="cursor-pointer text-sm font-semibold ring-1 ring-transparent transition-colors hover:ring-primary"
          >
            Sign out
          </Button>
        </form>
      </div>

      <section className="mt-6">
        <h2 className="mb-4 text-lg font-bold tracking-tight">Orders</h2>

        {orders.length === 0 ? (
          <div className="bg-secondary px-6 py-12 text-center">
            <p className="text-sm">You don&apos;t have any orders yet.</p>
            <Link
              href="/search"
              className="mt-5 inline-flex h-11 cursor-pointer items-center justify-center bg-primary px-6 text-sm font-semibold transition-colors"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const lineItems = order.lineItems.edges.map((edge) => edge.node)

              return (
                <article
                  key={order.id}
                  className="border border-primary bg-secondary p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">{order.name}</p>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {formatOrderDate(order.processedAt)}
                      </p>
                    </div>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer ring-1 ring-transparent hover:ring-primary"
                          >
                            Address
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" asChild>
                          <div>
                            <p className="text-sm">
                              {order.shippingAddress?.firstName}{" "}
                              {order.shippingAddress?.lastName}
                            </p>
                            <p className="text-sm">
                              {order.shippingAddress?.address1}{" "}
                              {order.shippingAddress?.address2}
                            </p>
                            <p className="text-sm">
                              {order.shippingAddress?.city}{" "}
                              {order.shippingAddress?.country}
                            </p>
                            {order.shippingAddress?.company ? (
                              <p className="text-sm">
                                {order.shippingAddress?.company}
                              </p>
                            ) : null}
                            <p className="text-sm">
                              {order.shippingAddress?.province}{" "}
                              {order.shippingAddress?.zip}
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Price amount={order.totalPrice} className="mt-4" />
                    </div>
                  </div>

                  {lineItems.length > 0 && (
                    <div className="mt-4 flex flex-col gap-3">
                      {lineItems.map((lineItem, index) => (
                        <div
                          key={`${order.id}-${lineItem.title}-${index}`}
                          className="flex items-center gap-3"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-background">
                            {lineItem.image ? (
                              <Image
                                src={shopifyImageUrl(lineItem.image.url, 112)}
                                alt={lineItem.image.altText ?? lineItem.title}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {lineItem.title}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              Qty {lineItem.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
