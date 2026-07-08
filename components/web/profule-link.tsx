import { User } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

export function ProfileLink() {
  return (
    <Link href="/account" aria-label="Sign in to your account">
      <Button
        variant="outline"
        className="cursor-pointer ring-1 ring-transparent hover:ring-primary"
        aria-label="Sign in to your account"
      >
        <User className="size-4" />
      </Button>
    </Link>
  )
}
