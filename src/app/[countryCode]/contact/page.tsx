import { Metadata } from "next"
import { buildSeoMetadata } from "@lib/data/seo"
import SeoJsonLd from "@modules/common/components/seo-json-ld"
import ManualSeoSchema from "@modules/common/components/manual-seo-schema"
import ContactClient from "./_components/ContactClient"

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata(["contact"], {
    title: "Contact | Mommantum",
    description:
      "Contact Mommantum to discuss growth strategy, performance marketing, SEO, web development, and AI workflow projects.",
    canonicalPath: "/contact",
  })
}

export default function ContactPage() {
  return (
    <>
      <SeoJsonLd pageKeys={["contact"]} />
      <ManualSeoSchema 
        type="normal" 
        data={{
          page_title: "Contact | Mommantum",
          meta_description: "Contact Mommantum to discuss growth strategy, performance marketing, SEO, web development, and AI workflow projects.",
          page_url: "https://www.mommantum.com/in/contact",
          primary_keyword: "Contact Digital Marketing Agency",
          faq_json_10: []
        }} 
      />
      <ContactClient />
    </>
  )
}
