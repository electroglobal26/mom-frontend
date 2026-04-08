export type CaseStudy = {
  slug: string
  category: string
  title: string
  tagline?: string
  about?: string
  challenge: string
  whatWeDid: string[]
  results: string[]
  image: string
  accent?: string
  overview?: string
  solution?: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "jalvayu-wellness",
    category: "Eco-friendly D2C / Incense",
    title: "Jalvayu Wellness",
    tagline: "Real brands. Real growth.",
    about:
      "Jaipur-based sustainable incense brand turning temple flower waste into premium dhoop sticks and cones.",
    challenge:
      "Strong product, but lacked high-performing creatives and consistent revenue.",
    whatWeDid: [
      "Created storytelling-led creative strategy",
      "Shot performance-focused content",
      "Built Meta conversion funnels",
      "Improved landing page clarity",
    ],
    results: [
      "2× revenue in 45 days",
      "28% lower CAC",
      "Multiple winning creatives",
    ],
    image: "/images/case-studies/jalvayu.webp",
    accent: "#e61e73",
    overview:
      "Jalvayu Wellness had a meaningful product and a strong brand story, but the digital experience and creative system were not converting as strongly as they should. The goal was to build a sharper performance-driven creative direction while keeping the brand’s sustainability story intact.",
    solution:
      "We combined storytelling, performance content, Meta funnel strategy, and landing page clarity improvements to create a more conversion-ready growth system.",
  },
  {
    slug: "electroglobal",
    category: "Engineering / D2C",
    title: "ElectroGlobal",
    about:
      "An engineering-led brand looking to improve online presence, content consistency, and inbound demand.",
    challenge: "Low visibility and weak inbound pipeline.",
    whatWeDid: [
      "Shot reels and product videos",
      "Built consistent content strategy",
    ],
    results: [
      "4× inbound leads",
      "Higher engagement",
    ],
    image: "/images/case-studies/electroglobal.webp",
    accent: "#e61e73",
    overview:
      "ElectroGlobal needed stronger digital visibility and a more consistent brand presence. The focus was on building content that looked professional, explained the offering clearly, and attracted more inbound interest.",
    solution:
      "We developed a practical content direction built around reels, product communication, and a more regular publishing system that helped improve reach and lead quality.",
  },
  {
    slug: "urban-vada-pav",
    category: "QSR / F&B",
    title: "Urban Vada Pav",
    about:
      "A vada pav chain offering 17 unique flavours and looking to strengthen digital recall and local demand.",
    challenge:
      "Strong offline presence, but needed digital visibility and flavour-focused content.",
    whatWeDid: [
      "Shot high-engagement reels",
      "Highlighted 17 signature flavours",
      "Ran hyper-local Meta campaigns",
    ],
    results: [
      "5× footfall growth",
      "Massive brand recall",
      "Higher customer engagement",
    ],
    image: "/images/case-studies/urban-vada-pav.webp",
    accent: "#e61e73",
    overview:
      "Urban Vada Pav already had strong offline appeal, but the digital side of the brand was not creating the same excitement. The objective was to turn flavour variety and local appeal into attention-grabbing content.",
    solution:
      "We built reel-first content, emphasized the signature flavour range, and ran hyper-local campaigns that made the brand more memorable and drove stronger footfall.",
  },
]

export const teamMember = {
  name: "Kuldeep Ahir",
  role: "Creative Director",
  description:
    "A growth-focused creator helping D2C brands scale through strategic content, performance marketing, and aligned execution.",
  image: "/team/kuldeep.webp",
}

export const testimonials = [
  {
    quote:
      "Momentum helped us structure our content and ads, and the results were immediate. Our CAC dropped and consistency improved.",
    author: "Jalvayu Team",
  },
  {
    quote:
      "Their content direction changed our brand visibility completely.",
    author: "Pooddles Petcare",
  },
  {
    quote:
      "We grew faster because the strategy was clear.",
    author: "ElectroGlobal",
  },
]