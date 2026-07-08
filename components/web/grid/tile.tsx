import clsx from "clsx"
import Image from "next/image"
import Label from "../label"

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean
  active?: boolean
  label?: {
    title: string
    amount: string
    currencyCode: string
    position?: "bottom" | "center"
  }
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        "group relative flex h-full w-full items-center justify-center overflow-hidden bg-secondary ring-1 ring-transparent hover:ring-primary",
        {
          relative: label,
          "border-2 border-primary": active,
          "border-neutral-200 dark:border-neutral-800": !active,
        }
      )}
    >
      {props.src ? (
        <Image
          loading="eager"
          className={clsx("relative h-full w-full object-cover", {
            "transition duration-300 ease-in-out group-hover:scale-105":
              isInteractive,
          })}
          {...props}
        />
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  )
}
