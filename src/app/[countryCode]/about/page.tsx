import { Metadata } from "next"
import { buildSeoMetadata, getSeoSetting } from "@lib/data/seo"
import SeoJsonLd from "@modules/common/components/seo-json-ld"
import ManualSeoSchema from "@modules/common/components/manual-seo-schema"
import AboutClient from "./_components/AboutClient"

export const revalidate = 60

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
  const seoSetting = await getSeoSetting("about")

  return (
    <>
      <SeoJsonLd pageKeys={["about"]} />
      <ManualSeoSchema 
        type="normal" 
        data={{
          ...(seoSetting || {}),
          page_title: seoSetting?.meta_title || "About | Mommantum",
          meta_description: seoSetting?.meta_description || "Learn about Mommantum, a Jaipur-based growth studio helping brands scale with strategy, creative, SEO, and performance marketing.",
          page_url: "https://www.mommantum.com/in/about",
          faq_json_10: (seoSetting as any)?.faq_section || []
        }} 
      />
      <AboutClient countryCode={countryCode} />
    </>
  )
}
