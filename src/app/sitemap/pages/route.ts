import { NextResponse } from "next/server"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mommantum.com"

const pages = [
  { url: `${baseUrl}`,           changeFrequency: "weekly"  },
  { url: `${baseUrl}/about`,     changeFrequency: "monthly" },
  { url: `${baseUrl}/services`,  changeFrequency: "weekly"  },
  { url: `${baseUrl}/blog`,      changeFrequency: "daily"   },
  { url: `${baseUrl}/contact`,   changeFrequency: "monthly" },
  { url: `${baseUrl}/work`,      changeFrequency: "weekly"  },
]

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${p.url}</loc>
    <changefreq>${p.changeFrequency}</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join("\n")}
</urlset>`

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  })
}