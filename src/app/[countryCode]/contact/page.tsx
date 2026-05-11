import { Metadata } from "next"
import { buildSeoMetadata, getSeoSetting } from "@lib/data/seo"
import SeoJsonLd from "@modules/common/components/seo-json-ld"
import ManualSeoSchema from "@modules/common/components/manual-seo-schema"
import ContactClient from "./_components/ContactClient"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata(["contact"], {
    title: "Contact | Mommantum",
    description:
      "Contact Mommantum to discuss growth strategy, performance marketing, SEO, web development, and AI workflow projects.",
    canonicalPath: "/contact",
  })
}

export default async function ContactPage() {
  const seoSetting = await getSeoSetting("contact")

  return (
    <>
      <SeoJsonLd pageKeys={["contact"]} />
      <ManualSeoSchema 
        type="normal" 
        data={{
          ...(seoSetting || {}),
          page_title: seoSetting?.meta_title || "Contact | Mommantum",
          meta_description: seoSetting?.meta_description || "Contact Mommantum to discuss growth strategy, performance marketing, SEO, web development, and AI workflow projects.",
          page_url: "https://www.mommantum.com/in/contact",
          faq_json_10: (seoSetting as any)?.faq_section || []
        }} 
      />
      <ContactClient />
    </>
  )
}
