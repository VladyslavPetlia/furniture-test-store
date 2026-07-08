"use server"

import { TAGS } from "@/lib/constants"
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "@/lib/shopify"
import { updateTag } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function addItem(
  _prevState: unknown, // Fix: Changed 'any' to 'unknown' to avoid no-explicit-any
  selectedVariantId: string | undefined
) {
  if (!selectedVariantId) {
    return "Error adding item to cart"
  }

  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }])
    updateTag(TAGS.cart)
  } catch (_e) {
    // Fix: Added underscore to un-read variable 'e'
    return "Error adding item to cart"
  }
}

export async function removeItem(_prevState: unknown, merchandiseId: string) {
  // Fix: Changed 'any' to 'unknown'
  try {
    const cart = await getCart()

    if (!cart) {
      return "Error fetching cart"
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    )

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id])
      updateTag(TAGS.cart)
    } else {
      return "Item not found in cart"
    }
  } catch (_e) {
    // Fix: Added underscore to un-read variable 'e'
    return "Error removing item from cart"
  }
}

export async function updateItemQuantity(
  _prevState: unknown, // Fix: Changed 'any' to 'unknown'
  payload: {
    merchandiseId: string
    quantity: number
  }
) {
  const { merchandiseId, quantity } = payload

  try {
    const cart = await getCart()

    if (!cart) {
      return "Error fetching cart"
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    )

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id])
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ])
      }
    } else if (quantity > 0) {
      await addToCart([{ merchandiseId, quantity }])
    }

    updateTag(TAGS.cart)
  } catch (e) {
    console.error(e) // This one stays 'e' because it IS used by console.error()
    return "Error updating item quantity"
  }
}

export async function redirectToCheckout() {
  const cart = await getCart()
  redirect(cart!.checkoutUrl)
}

export async function createCartAndSetCookie() {
  const cart = await createCart()

  const cookieStore = await cookies()
  cookieStore.set("cartId", cart.id!)
}
