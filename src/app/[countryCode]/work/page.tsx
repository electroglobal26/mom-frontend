import { getCaseStudies, getTestimonials, teamMember } from "@lib/data/case-studies"
import WorkPage from "./_components/WorkClient"

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
    <WorkPage
      params={{ countryCode }}
      caseStudies={caseStudies}
      testimonials={testimonials}
      teamMember={teamMember}
    />
  )
}