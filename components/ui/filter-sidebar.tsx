"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterValue {
  id: string
  label: string
  count: number
}

interface FilterGroup {
  id: string
  label: string
  type: string // LIST or PRICE_RANGE
  values: FilterValue[]
}

export function FilterSidebar({
  filterGroups,
}: {
  filterGroups: FilterGroup[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track active filters to show "Clear All" and bubble counts
  const totalActiveFilters = Array.from(searchParams.keys()).length
  const hasActiveFilters = totalActiveFilters > 0

  const updateUrlParams = (newParams: URLSearchParams) => {
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
  }

  // Clear all query parameters completely
  const handleClearAll = () => {
    router.push(pathname, { scroll: false })
  }

  // Multi-select list checkbox actions
  const handleListToggle = (groupLabel: string, valueLabel: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const urlKey = groupLabel.toLowerCase()

    if (params.has(urlKey, valueLabel)) {
      params.delete(urlKey, valueLabel)
    } else {
      params.append(urlKey, valueLabel)
    }
    updateUrlParams(params)
  }

  // Custom numeric price input updates
  const handlePriceChange = (type: "min" | "max", value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentPrice = params.get("price") || "-"
    let [min, max] = currentPrice.split("-")

    if (type === "min") min = value || ""
    if (type === "max") max = value || ""

    const combinedPriceString = `${min}-${max}`

    if (combinedPriceString === "-" || combinedPriceString === "") {
      params.delete("price")
    } else {
      params.set("price", combinedPriceString)
    }
    updateUrlParams(params)
  }

  return (
    <div className="w-full md:w-auto">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            className="flex min-h-10 w-full items-center justify-between border border-black/30 text-sm hover:cursor-pointer dark:border-white/30"
          >
            <span>Filters</span>
            <SlidersHorizontal className="h-4 w-4" />
            {hasActiveFilters && (
              <span className="ml-1 bg-primary px-2 py-0.5 text-[10px] font-medium text-white">
                {totalActiveFilters}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-full space-y-4 p-4 sm:w-85">
          {/* Header Actions */}
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-sm font-semibold tracking-wider text-neutral-900 uppercase dark:text-neutral-100">
              Filter Options
            </h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-auto p-1 text-xs text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Filter Body */}
          <Accordion
            type="multiple"
            defaultValue={filterGroups.map((g) => g.id)}
            className="max-h-87.5 w-full overflow-y-auto pr-1"
          >
            {filterGroups.map((group) => {
              if (!group.values || group.values.length === 0) return null

              const isPrice =
                group.type === "PRICE_RANGE" ||
                group.label.toLowerCase() === "price"

              return (
                <AccordionItem
                  key={group.id}
                  value={group.id}
                  className="border-b border-neutral-200 py-1 dark:border-neutral-800"
                >
                  <AccordionTrigger className="flex py-2 text-sm font-medium tracking-wider text-neutral-800 uppercase select-none hover:no-underline dark:text-neutral-200">
                    <span className="capitalize">{group.label}</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2 pb-4">
                    {isPrice ? (
                      /* RENDER METHOD A: Dynamic Numeric Range Fields */
                      <div className="flex items-center space-x-2 px-1">
                        <div className="flex w-full items-center rounded border border-neutral-200 bg-white px-2 py-1 dark:border-neutral-800 dark:bg-neutral-900">
                          <span className="mr-1 text-xs text-neutral-400">
                            $
                          </span>
                          <Input
                            type="number"
                            placeholder="Min"
                            defaultValue={
                              searchParams.get("price")?.split("-") || ""
                            }
                            onBlur={(e) =>
                              handlePriceChange("min", e.target.value)
                            }
                            className="w-full border-none bg-transparent p-0 text-xs text-black shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white"
                          />
                        </div>
                        <span className="text-xs text-neutral-400">to</span>
                        <div className="flex w-full items-center rounded border border-neutral-200 bg-white px-2 py-1 dark:border-neutral-800 dark:bg-neutral-900">
                          <span className="mr-1 text-xs text-neutral-400">
                            $
                          </span>
                          <Input
                            type="number"
                            placeholder="Max"
                            defaultValue={
                              searchParams.get("price")?.split("-") || ""
                            }
                            onBlur={(e) =>
                              handlePriceChange("max", e.target.value)
                            }
                            className="w-full border-none bg-transparent p-0 text-xs text-black shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white"
                          />
                        </div>
                      </div>
                    ) : (
                      /* RENDER METHOD B: Standard Variant Checkboxes Loop */
                      group.values.map((val) => {
                        const urlKey = group.label.toLowerCase()
                        const isChecked = searchParams.has(urlKey, val.label)
                        const isDisabled = val.count === 0 && !isChecked

                        return (
                          <div
                            key={val.id}
                            className="flex items-center space-x-3 px-1"
                          >
                            <Checkbox
                              id={val.id}
                              checked={isChecked}
                              disabled={isDisabled}
                              onCheckedChange={() =>
                                handleListToggle(group.label, val.label)
                              }
                              className="h-4 w-4 cursor-pointer border-neutral-300 text-black focus:ring-black disabled:cursor-not-allowed disabled:opacity-40"
                            />
                            <Label
                              htmlFor={val.id}
                              className={cn(
                                "flex w-full cursor-pointer items-center justify-between text-xs transition-colors select-none",
                                isDisabled
                                  ? "cursor-not-allowed text-neutral-400 line-through dark:text-neutral-600"
                                  : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
                              )}
                            >
                              <span>{val.label}</span>
                              <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
                                ({val.count})
                              </span>
                            </Label>
                          </div>
                        )
                      })
                    )}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </PopoverContent>
      </Popover>
    </div>
  )
}
