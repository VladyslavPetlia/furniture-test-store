import Link from "next/link"
import { Button, buttonVariants } from "../ui/button"
import clsx from "clsx"

export default function MainButton({ text }: { text: string }) {
  return (
    <Link
      href={"/search"}
      className={clsx(
        buttonVariants({}),
        "cursor-pointer px-10 py-6 text-lg font-medium uppercase"
      )}
    >
      <span className="sr-only">Search all furniture products</span>
      {text}
    </Link>
  )
}
