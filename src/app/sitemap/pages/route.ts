// app/sitemap/pages/route.ts  →  serves /sitemap/pages
import { NextResponse } from "next/server"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mommantum.com"

const pages = [
  { url: `${baseUrl}`,                changeFrequency: "weekly",  priority: "1.0" },
  { url: `${baseUrl}/about`,          changeFrequency: "monthly", priority: "0.8" },
  { url: `${baseUrl}/services`,       changeFrequency: "weekly",  priority: "0.9" },
  { url: `${baseUrl}/blog`,           changeFrequency: "daily",   priority: "0.8" },
  { url: `${baseUrl}/contact`,        changeFrequency: "monthly", priority: "0.7" },
  { url: `${baseUrl}/work`,           changeFrequency: "weekly",  priority: "0.8" },
  // ── Service pages ──────────────────────────────────────────────────────────
  { url: `${baseUrl}/services/performance-marketing`,       changeFrequency: "monthly", priority: "0.8" },
  { url: `${baseUrl}/services/conversion-rate-optimization`,changeFrequency: "monthly", priority: "0.8" },
  { url: `${baseUrl}/services/search-engine-optimization`,  changeFrequency: "monthly", priority: "0.8" },
  { url: `${baseUrl}/services/script-copywriting`,          changeFrequency: "monthly", priority: "0.7" },
  { url: `${baseUrl}/services/d2c-branding-scale-growth`,   changeFrequency: "monthly", priority: "0.7" },
  { url: `${baseUrl}/services/social-media-marketing`,      changeFrequency: "monthly", priority: "0.8" },
  { url: `${baseUrl}/services/strategy-consulting`,         changeFrequency: "monthly", priority: "0.7" },
  { url: `${baseUrl}/services/web-app-development`,         changeFrequency: "monthly", priority: "0.8" },
  { url: `${baseUrl}/services/ai-automation`,               changeFrequency: "monthly", priority: "0.8" },
  { url: `${baseUrl}/services/ai-agentic-service`,          changeFrequency: "monthly", priority: "0.7" },
  { url: `${baseUrl}/services/ai-video-generation`,         changeFrequency: "monthly", priority: "0.7" },
]

export function GET() {
  const lastmod = new Date().toISOString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <changefreq>${p.changeFrequency}</changefreq>
    <priority>${p.priority}</priority>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  })
}