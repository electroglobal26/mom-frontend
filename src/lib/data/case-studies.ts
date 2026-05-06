import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type CaseStudyMetric = {
  label: string
  before: string
  after: string
}

export type CaseStudy = {
  id?: string
  slug: string
  category: string
  title: string
  tagline?: string
  about?: string
  challenge: string
  overview?: string
  solution?: string
  insights?: string
  image: string
  accent?: string
  whatWeDid: string[]
  results: string[]
  metrics: CaseStudyMetric[]
}

export type Testimonial = {
  id?: string
  quote: string
  author: string
  role?: string
}

type CaseStudyRow = {
  id: string
  slug: string
  category: string
  title: string
  tagline: string | null
  about: string | null
  challenge: string
  overview: string | null
  solution: string | null
  insights: string | null
  image: string
  accent: string | null
  what_we_did: string[]
  results: string[]
  metrics: CaseStudyMetric[]
  created_at: string
}

type TestimonialRow = {
  id: string
  quote: string
  author: string
  role: string | null
  created_at: string
}

function mapRow(s: CaseStudyRow): CaseStudy {
  return {
    id: s.id,
    slug: s.slug,
    category: s.category,
    title: s.title,
    tagline: s.tagline ?? undefined,
    about: s.about ?? undefined,
    challenge: s.challenge,
    overview: s.overview ?? undefined,
    solution: s.solution ?? undefined,
    insights: s.insights ?? undefined,
    image: s.image,
    accent: s.accent ?? "#e61e73",
    whatWeDid: s.what_we_did || [],
    results: s.results || [],
    metrics: s.metrics || [],
  }
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .order("created_at", { ascending: true })

  if (error || !data) return []
  return (data as CaseStudyRow[]).map(mapRow)
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error || !data) return null
  return mapRow(data as CaseStudyRow)
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: true })

  if (error || !data) return []

  return (data as TestimonialRow[]).map((t) => ({
    id: t.id,
    quote: t.quote,
    author: t.author,
    role: t.role ?? undefined,
  }))
}

// teamMember stays static — it's personal info not needing a DB
export const teamMember = {
  name: "Kuldeep Ahir",
  role: "Founder & Creative Director",
  description:
    "A growth-focused creator helping D2C brands scale through strategic content, performance marketing, and aligned execution. Based in Jaipur, working with brands across India.",
  image: "/team/kuldeep.webp",
}