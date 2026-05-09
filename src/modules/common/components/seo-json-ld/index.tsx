import { getSeoJsonLd } from "@lib/data/seo"

type SeoJsonLdProps = {
  pageKeys: Array<string | undefined | null>
}

export default async function SeoJsonLd({ pageKeys }: SeoJsonLdProps) {
  const schema = await getSeoJsonLd(pageKeys)

  if (!schema) return null

  try {
    const json = JSON.stringify(JSON.parse(schema))

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: json }}
      />
    )
  } catch {
    return null
  }
}
