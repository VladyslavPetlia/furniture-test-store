export function parseUrlParamsToShopifyFilters(searchParams: URLSearchParams) {
  const filters: any[] = []

  // Track price boundaries into a single unified object container
  let priceFilter: { min?: number; max?: number } | null = null

  searchParams.forEach((value, key) => {
    // 1. Variant option checkbox filter mappings (Size/Color)
    if (key === "size" || key === "color" || key === "material") {
      filters.push({
        variantOption: { name: key, value: value },
      })
    }

    // 2. Aggregates values into a unified pricing slider block
    if (key === "price") {
      const [minStr, maxStr] = value.split("-")

      // Parse values, ensuring empty fields fall back safely without forcing an absolute 0 condition
      const min = minStr ? parseFloat(minStr) : NaN
      const max = maxStr ? parseFloat(maxStr) : NaN

      if (!priceFilter) {
        priceFilter = {}
      }

      if (!isNaN(min)) priceFilter.min = min
      if (!isNaN(max)) priceFilter.max = max
    }
  })

  // Only push the single unified price block if boundaries were defined
  if (priceFilter) {
    filters.push({ price: priceFilter })
  }

  return filters
}
