import AboutClient from "./_components/AboutClient"

export default async function AboutPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  return <AboutClient countryCode={countryCode} />
}