import { Metadata } from "next"
import { buildSeoMetadata } from "@lib/data/seo"
import SeoJsonLd from "@modules/common/components/seo-json-ld"
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
      <AboutClient countryCode={countryCode} />
    </>
  )
}
