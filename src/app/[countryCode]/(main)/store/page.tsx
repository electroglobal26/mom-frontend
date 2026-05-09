import { Metadata } from "next"

import { buildSeoMetadata } from "@lib/data/seo"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata(["store", "shop"], {
    title: "Store",
    description: "Explore all of our products.",
    canonicalPath: "/store",
  })
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
