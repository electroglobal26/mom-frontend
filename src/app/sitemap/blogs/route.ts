import { NextResponse } from "next/server"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mommantum.com"
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

function xmlSafe(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export async function GET() {
  let blogs: any[] = []

  try {
    const res = await fetch(`${BACKEND_URL}/custom/blog/posts`, {
      next: { revalidate: 3600 },
    })
    const data = await res.json()
    blogs = data.posts || []
  } catch {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogs
  .filter(b => !!b.slug)
  .map(b => `  <url>
    <loc>${xmlSafe(`${baseUrl}/blog/${b.slug}`)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date(b.updated_at || b.created_at).toISOString()}</lastmod>
  </url>`).join("\n")}
</urlset>`

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  })
}