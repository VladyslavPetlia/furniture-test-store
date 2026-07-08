import clsx from "clsx"
import Image from "next/image"

export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  return (
    <div
      className={clsx(
        "relative flex flex-none items-center justify-center dark:bg-black",
        {
          "h-10 w-10": !size,
          "h-7.5 w-7.5": size === "sm",
        }
      )}
    >
      <Image
        src="/Logo.svg"
        alt="Logo"
        fill
        className={clsx({
          "h-4 w-4": !size,
          "h-2.5 w-2.5": size === "sm",
        })}
      />
    </div>
  )
}
