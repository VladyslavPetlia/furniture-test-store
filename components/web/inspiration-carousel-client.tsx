"use client"

import * as React from "react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { InspirationCarouselItem } from "@/lib/shopify/types"

interface ClientProps {
  images: InspirationCarouselItem[]
}

export function InspirationCarouselClient({ images }: ClientProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // Defers layout math entirely until after the browser paints the initial frame
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render a lightweight, zero-JS layout skeleton matching your slide dimensions
    // This perfectly prevents layout shifts (CLS) without running layout thrashing scripts
    return (
      <div className="flex w-full gap-4 opacity-50">
        <div className="aspect-3/4 basis-full animate-pulse rounded-xl bg-primary/20 md:basis-1/2" />
      </div>
    )
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
        skipSnaps: true,
        watchSlides: false,
      }}
      className="w-full"
    >
      <CarouselContent>
        {images.map((img, index) => (
          <CarouselItem key={index} className="basis-full md:basis-1/2">
            <Card className="group overflow-hidden bg-primary pt-0 text-card-foreground shadow transition-all">
              <div className="relative aspect-3/4 w-full overflow-hidden bg-primary">
                <Image
                  src={img.url}
                  alt={img.altText || "Inspiration room view"}
                  fill
                  quality={70}
                  sizes="(min-width: 1280px) 480px, (min-width: 768px) 40vw, 100vw"
                  className="object-cover transition-all group-hover:scale-105"
                  priority={index < 2}
                  loading={index >= 2 ? "lazy" : undefined}
                />
              </div>

              <CardHeader className="bg-primary">
                <CardTitle className="text-2xl font-bold text-white">
                  {img.altText}
                </CardTitle>
                <CardDescription className="mt-1 max-h-16 min-h-16 text-lg text-white">
                  {img.titleField || "No look description available."}
                </CardDescription>
              </CardHeader>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div>
        <CarouselPrevious className="-left-12" />
        <CarouselNext className="-right-12" />
      </div>
    </Carousel>
  )
}
