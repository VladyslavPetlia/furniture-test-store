import Image from "next/image"
import MainButton from "./main-button"

export default function Hero() {
  return (
    <div className="relative mx-auto max-w-(--breakpoint-2xl) overflow-hidden bg-secondary">
      <div className="relative">
        <div className="relative h-full w-full pb-100 md:pb-0">
          <Image
            alt="Decorated room image"
            src="/hero.webp"
            width={1335}
            height={751}
            quality={75}
            priority // High priority preloading for LCP
            fetchPriority="high"
            className="h-auto w-full max-w-500 object-cover"
            sizes="(min-width: 1340px) 1335px, 100vw"
          />
          <div className="absolute top-[60%] left-[50%] max-w-150 translate-x-[-50%] bg-[#46edd5] p-8 md:top-[50%] md:translate-x-0 md:translate-y-[-50%]">
            <h1 className="w-80 text-3xl font-bold text-primary uppercase md:text-4xl lg:w-115 lg:text-5xl xl:w-145 xl:text-6xl">
              Best Clothes That Matches Your Style
            </h1>
            <p className="mb-6 w-85 text-neutral-800 lg:w-115 xl:w-135">
              Browse through our diverse range of meticulously crafted
              garments.Designed to bring out your individuality and cater to
              your sense of style.
            </p>
            <div className="flex items-center">
              <MainButton text="Shop Now" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
