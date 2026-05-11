import { Metadata } from "next"
import { buildSeoMetadata } from "@lib/data/seo"

import Hero from "@modules/home/components/hero"
import SeoJsonLd from "@modules/common/components/seo-json-ld"
import ManualSeoSchema from "@modules/common/components/manual-seo-schema"
import WhyMommentum from "@modules/home/components/why-mommentum"
import WhoWeAre from "@modules/home/components/who-we-are"
import StatsStrip from "@modules/home/components/stats-strip"
import OurServices from "@modules/home/components/our-services"
import CaseStudies from "@modules/home/components/case-studies"

import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata(["homepage", "home"], {
    title: "Momentum",
    description: "Growth studio",
    canonicalPath: "/",
  })
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!region) return null

  return (
    <>
      <SeoJsonLd pageKeys={["homepage", "home"]} />
      <ManualSeoSchema 
        type="homepage" 
        data={{
          primary_keyword: "Digital Marketing Agency Jaipur",
          secondary_keyword_1: "Performance Marketing",
          secondary_keyword_2: "SEO Services",
          secondary_keyword_3: "E-commerce Growth",
          secondary_keyword_4: "Creative Strategy"
        }} 
      />
      <Hero />
      <WhyMommentum />
      <WhoWeAre />
      <StatsStrip />
      <OurServices />

      {/* ✅ FIX */}
      <CaseStudies countryCode={countryCode} />

    </>
  )
}
