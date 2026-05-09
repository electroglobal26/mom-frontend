import { Metadata } from "next"
import { getCaseStudies, getTestimonials, teamMember } from "@lib/data/case-studies"
import { buildSeoMetadata } from "@lib/data/seo"
import SeoJsonLd from "@modules/common/components/seo-json-ld"
import WorkPage from "./_components/WorkClient"

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata(["work", "case-studies"], {
    title: "Work | Mommantum",
    description:
      "Explore Mommantum case studies, client work, and growth results across marketing, ecommerce, SEO, and creative systems.",
    canonicalPath: "/work",
  })
}

export default async function WorkPageServer({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  const [caseStudies, testimonials] = await Promise.all([
    getCaseStudies(),
    getTestimonials(),
  ])

  return (
    <>
      <SeoJsonLd pageKeys={["work", "case-studies"]} />
      <WorkPage
        params={{ countryCode }}
        caseStudies={caseStudies}
        testimonials={testimonials}
        teamMember={teamMember}
      />
    </>
  )
}
