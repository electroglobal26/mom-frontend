import { Metadata } from "next"
import { getServices } from "@lib/data/services"
import { buildSeoMetadata } from "@lib/data/seo"
import SeoJsonLd from "@modules/common/components/seo-json-ld"
import ServicesClient from "./_components/ServicesClient"

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata(["services"], {
    title: "Services | Mommantum",
    description:
      "Explore Mommantum services across performance marketing, SEO, content, web development, and growth systems.",
    canonicalPath: "/services",
  })
}

export default async function ServicesPage() {
  const services = await getServices()
  return (
    <>
      <SeoJsonLd pageKeys={["services"]} />
      <ServicesClient services={services} />
    </>
  )
}
