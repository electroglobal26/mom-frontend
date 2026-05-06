import { getCaseStudies, getTestimonials, teamMember } from "@lib/data/case-studies"
import WorkPage from "./_components/WorkClient"

export default async function WorkPageServer({
  params,
}: {
  params: { countryCode: string }
}) {
  const [caseStudies, testimonials] = await Promise.all([
    getCaseStudies(),
    getTestimonials(),
  ])

  return (
    <WorkPage
      params={params}
      caseStudies={caseStudies}
      testimonials={testimonials}
      teamMember={teamMember}
    />
  )
}