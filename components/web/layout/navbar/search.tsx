"use client"

import Form from "next/form"
import { Field } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export default function Search() {
  const searchParams = useSearchParams()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Open search menu"
          variant="outline"
          className="size-8 ring-1 ring-transparent hover:ring-primary"
        >
          <span className="sr-only">Search all furniture products</span>
          <SearchIcon aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent asChild>
        <Form
          action="/search"
          className="w-max-[550px] relative w-full min-w-80 lg:w-80 xl:w-full"
        >
          <Field className="max-w-md">
            <InputGroup>
              <InputGroupInput
                id="inline-start-input"
                aria-label="Search items" // Ensures the input field itself is accessible
                placeholder="Search..."
                key={searchParams?.get("q")}
                type="text"
                name="q"
                autoComplete="off"
                defaultValue={searchParams?.get("q") || ""}
              />
              <InputGroupAddon align="inline-start">
                <SearchIcon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </Form>
      </PopoverContent>
    </Popover>
  )
}

export function SearchSkeleton() {
  return (
    <div className="flex w-fit items-center gap-4">
      <Skeleton className="size-10" />
    </div>
  )
}
