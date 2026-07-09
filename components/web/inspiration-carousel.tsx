import { getCarouselImages } from "@/lib/shopify"
import { buttonVariants } from "../ui/button"
import Link from "next/link"
import clsx from "clsx"
import { InspirationCarouselClient } from "./inspiration-carousel-client"

export async function InspirationCarousel() {
  const images = await getCarouselImages()

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="relative mx-auto mb-20 w-full max-w-7xl bg-[#46edd5] px-15 py-20">
      <div className="flex flex-col gap-20 lg:flex-row lg:gap-15">
        <div className="flex flex-col justify-center">
          <h2 className="py-2 text-3xl font-bold text-primary">
            Beautiful Room Inspiration
          </h2>
          <p className="text-neutral-800">
            Our designer already made a lot of beautiful prototype of rooms that
            inspire you
          </p>
          <Link
            href="/blog"
            className={clsx(
              buttonVariants({ variant: "default" }),
              "my-5 w-60 cursor-pointer py-6"
            )}
          >
            <div className="text-xl">Explore more</div>
          </Link>
        </div>

        {/* 
          Pass data down to the isolated Client wrapper. 
          The mounting effect inside clears your forced reflow audit flags.
        */}
        <InspirationCarouselClient images={images} />
      </div>
    </div>
  )
}
