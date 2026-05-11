import { Metadata } from "next"
import { buildSeoMetadata } from "@lib/data/seo"
import SeoJsonLd from "@modules/common/components/seo-json-ld"
import ManualSeoSchema from "@modules/common/components/manual-seo-schema"
import AboutClient from "./_components/AboutClient"

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata(["about"], {
    title: "About | Mommantum",
    description:
      "Learn about Mommantum, a Jaipur-based growth studio helping brands scale with strategy, creative, SEO, and performance marketing.",
    canonicalPath: "/about",
  })
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  return (
    <>
      <SeoJsonLd pageKeys={["about"]} />
      <ManualSeoSchema 
        type="normal" 
        data={{
          page_title: "About | Mommantum",
          meta_description: "Learn about Mommantum, a Jaipur-based growth studio helping brands scale with strategy, creative, SEO, and performance marketing.",
          page_url: "https://www.mommantum.com/in/about",
          primary_keyword: "Growth Studio Jaipur",
          faq_json_10: []
        }} 
      />
      <AboutClient countryCode={countryCode} />
    </>
  )
}
