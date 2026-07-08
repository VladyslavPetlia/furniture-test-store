import z from "zod"

const envSchema = z.object({
  COMPANY_NAME: z.string(),
  SITE_NAME: z.string(),
  SHOPIFY_REVALIDATION_SECRET: z.string(),
  SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string(),
  SHOPIFY_STORE_DOMAIN: z.string(),
})

envSchema.parse(process.env)

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    //  Fix 1: Reverted back to an interface so TypeScript can merge types correctly
    //  Fix 2: Added a targeted ignore comment to satisfy the eslint rule for empty blocks
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
