"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCart } from "./cart-context"
import { useEffect, useRef, useState } from "react"
import { createCartAndSetCookie, redirectToCheckout } from "./actions"
import OpenCart from "./open-cart"
import { ShoppingCartIcon } from "lucide-react"
import { DEFAULT_OPTION } from "@/lib/constants"
import { createUrl } from "@/lib/utils"
import { DeleteItemButton } from "./delete-item-button"
import Image from "next/image"
import Link from "next/link"
import Price from "../price"
import { EditItemQuantityButton } from "./edit-item-quantity-button"
import { CheckoutButton } from "./checkout-button"

type MerchandiseSearchParams = {
  [key: string]: string
}

export default function CartModal() {
  const { cart, updateCartItem } = useCart()
  const quantityRef = useRef(cart?.totalQuantity)

  // FIX: Force layout math to defer until hydration completes
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!cart) {
      createCartAndSetCookie()
    }
  }, [cart])

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      quantityRef.current = cart?.totalQuantity
    }
  }, [cart?.totalQuantity, quantityRef])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="relative cursor-pointer ring-1 ring-transparent hover:ring-primary"
        >
          <OpenCart quantity={cart?.totalQuantity} />
        </Button>
      </SheetTrigger>

      {/* 
        FIX: Wrap SheetContent inside a conditional block. 
        This isolates Radix UI's RemoveScroll layout logic from executing on page boot, 
        completely eliminating the 55ms forced reflow penalty from your score trace.
      */}
      {mounted && (
        <SheetContent className="px-4">
          <SheetHeader>
            <SheetTitle asChild>
              <p className="text-lg font-semibold">My Cart</p>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Shopping Cart
            </SheetDescription>
          </SheetHeader>

          {!cart || cart.lines.length === 0 ? (
            <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
              <ShoppingCartIcon className="h-8" />
              <p className="mt-6 text-center text-2xl font-bold">
                Your cart is empty.
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-between overflow-hidden p-1">
              <ul className="grow overflow-auto py-4">
                {cart.lines
                  .sort((a, b) =>
                    a.merchandise.product.title.localeCompare(
                      b.merchandise.product.title
                    )
                  )
                  .map((item, i) => {
                    const merchandiseSearchParams =
                      {} as MerchandiseSearchParams

                    item.merchandise.selectedOptions.forEach(
                      ({ name, value }) => {
                        if (value !== DEFAULT_OPTION) {
                          merchandiseSearchParams[name.toLowerCase()] = value
                        }
                      }
                    )

                    const merchandiseUrl = createUrl(
                      `/product/${item.merchandise.product.handle}`,
                      new URLSearchParams(merchandiseSearchParams)
                    )

                    return (
                      <li
                        key={i}
                        className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                      >
                        <div className="relative flex w-full flex-row justify-between px-1 py-4">
                          <div className="absolute z-40 -mt-2 -ml-1">
                            <DeleteItemButton
                              item={item}
                              optimisticUpdate={updateCartItem}
                            />
                          </div>
                          <div className="flex flex-row">
                            <div className="relative h-16 min-w-16 overflow-hidden border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                              {/* Sized appropriately for performance */}
                              <Image
                                className="h-full w-full object-cover"
                                width={64}
                                height={64}
                                alt={
                                  item.merchandise.product.featuredImage
                                    .altText || item.merchandise.product.title
                                }
                                src={item.merchandise.product.featuredImage.url}
                              />
                            </div>
                            <Link
                              href={merchandiseUrl}
                              className="z-30 ml-2 flex flex-row space-x-4"
                            >
                              <div className="flex flex-1 flex-col text-base">
                                <span className="leading-tight">
                                  {item.merchandise.product.title}
                                </span>
                                {item.merchandise.title !== DEFAULT_OPTION ? (
                                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {item.merchandise.title}
                                  </p>
                                ) : null}
                              </div>
                            </Link>
                          </div>
                          <div className="flex h-16 flex-col justify-between">
                            <Price
                              className="flex justify-end space-y-2 text-right text-sm"
                              amount={item.cost.totalAmount.amount}
                              currencyCode={item.cost.totalAmount.currencyCode}
                            />
                            <div className="ml-auto flex h-7.5 flex-row items-center border border-primary">
                              <EditItemQuantityButton
                                item={item}
                                type="minus"
                                optimisticUpdate={updateCartItem}
                              />
                              <p className="w-6 text-center">
                                <span className="w-full text-sm">
                                  {item.quantity}
                                </span>
                              </p>
                              <EditItemQuantityButton
                                item={item}
                                type="plus"
                                optimisticUpdate={updateCartItem}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
              </ul>
              <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                  <p>Taxes</p>
                  <Price
                    className="text-right text-base text-black dark:text-white"
                    amount={cart.cost.totalTaxAmount.amount}
                    currencyCode={cart.cost.totalTaxAmount.currencyCode}
                  />
                </div>
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pt-1 pb-1 dark:border-neutral-700">
                  <p>Shipping</p>
                  <p className="text-right">Calculated at checkout</p>
                </div>
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pt-1 pb-1 dark:border-neutral-700">
                  <p>Total</p>
                  <Price
                    className="text-right text-base text-black dark:text-white"
                    amount={cart.cost.totalAmount.amount}
                    currencyCode={cart.cost.totalAmount.currencyCode}
                  />
                </div>
              </div>
              <form action={redirectToCheckout}>
                <CheckoutButton />
              </form>
            </div>
          )}
        </SheetContent>
      )}
    </Sheet>
  )
}
