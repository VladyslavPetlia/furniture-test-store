import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { shopifyImageUrl } from "@/lib/shopify/image"
import { getCarouselImages } from "@/lib/shopify"
import { InspirationCarouselItem } from "@/lib/shopify/types"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button, buttonVariants } from "../ui/button"
import Link from "next/link"
import clsx from "clsx"

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
            Beautiful Room Insperation
          </h2>
          <p className="text-neutral-800">
            Our designer already made a lot of beautiful prototipe of rooms that
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
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="">
            {images.map((img: InspirationCarouselItem, index: number) => {
              const optimizedSrc = shopifyImageUrl(img.url, 600)

              return (
                <CarouselItem key={index} className="basis-full md:basis-1/2">
                  <Card className="group overflow-hidden bg-primary pt-0 text-card-foreground shadow transition-all">
                    {/* Image Container with strict 3:4 aspect ratio layout */}
                    <div className="relative aspect-3/4 w-full overflow-hidden bg-primary">
                      <Image
                        src={optimizedSrc}
                        alt={img.altText}
                        fill
                        quality={70}
                        sizes="(min-width: 1280px) 300px, (min-width: 1024px) 33vw, (min-width: 768px) 430px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-all group-hover:scale-105"
                        priority={index < 2}
                        loading={index >= 2 ? "lazy" : undefined}
                      />
                    </div>

                    {/* Content details placed neatly beneath the image file box bounds */}
                    <CardHeader className="bg-primary">
                      <CardTitle className="text-2xl font-bold text-white">
                        {img.altText}
                      </CardTitle>
                      <CardDescription className="min-h-4rem max-h-4rem mt-1 text-lg text-white">
                        {img.titleField || "No look description available."}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </CarouselItem>
              )
            })}
          </CarouselContent>

          <div className="">
            <CarouselPrevious className="-left-12" />
            <CarouselNext className="-right-12" />
          </div>
        </Carousel>
      </div>
    </div>
  )
}
