import { Metadata } from "next"
import { getServices } from "@lib/data/services"
import { buildSeoMetadata } from "@lib/data/seo"
import SeoJsonLd from "@modules/common/components/seo-json-ld"
import ManualSeoSchema from "@modules/common/components/manual-seo-schema"
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
      <ManualSeoSchema 
        type="collection" 
        data={{
          category_title: "Services | Mommantum",
          meta_description: "Explore Mommantum services across performance marketing, SEO, content, web development, and growth systems.",
          category_url: "https://www.mommantum.com/in/services",
          primary_keyword: "Digital Marketing Services",
          services: services,
          faq_json_10: []
        }} 
      />
      <ServicesClient services={services} />
    </>
  )
}
