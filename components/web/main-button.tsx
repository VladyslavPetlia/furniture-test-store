import Link from "next/link"
import { Button } from "../ui/button"

export default function MainButton({ text }: { text: string }) {
  return (
    <Link href={"/search"}>
      <Button className="cursor-pointer px-10 py-6 text-lg font-medium uppercase">
        {text}
      </Button>
    </Link>
  )
}
