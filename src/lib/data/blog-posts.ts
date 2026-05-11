const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

export type FAQ = {
  question: string
  answer: string
}

export type BlogPost = {
  id: string
  slug: string
  title: string
  category_id: string | null
  featured_image: string | null
  image_urls: string[]
  excerpt: string | null
  content: string | null
  author_name: string | null
  status: string
  published_at: string | null
  updated_at: string | null
  meta_title: string | null
  meta_description: string | null
  faqs: FAQ[]
}

function normalizeImagePath(path: string): string {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path
  }
  return `/${path}`
}

function mapPost(p: any): BlogPost {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    category_id: p.category_id || null,
    featured_image: p.featured_image ? normalizeImagePath(p.featured_image) : null,
    image_urls: (p.image_urls || []).map(normalizeImagePath).filter(Boolean),
    excerpt: p.excerpt || null,
    content: p.content || null,
    author_name: p.author_name || null,
    status: p.status || "draft",
    published_at: p.published_at || null,
    updated_at: p.updated_at || null,
    meta_title: p.meta_title || null,
    meta_description: p.meta_description || null,
    faqs: p.faqs || [],
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/custom/blog/posts`, {
      next: { revalidate: 60 },   // cache 60s on Vercel, re-fetch in background
    })
    if (!res.ok) {
      console.error("getBlogPosts failed:", res.status)
      return []
    }
    const { posts } = await res.json()
    return (posts || []).map(mapPost)
  } catch (err) {
    console.error("getBlogPosts error:", err)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/custom/blog/posts/${slug}`, {
      next: { revalidate: 60 },   // cache 60s — new posts appear within 1 min
    })
    if (!res.ok) {
      console.error("getBlogPost failed:", res.status, slug)
      return null
    }
    const { post: p } = await res.json()
    if (!p) return null
    return mapPost(p)
  } catch (err) {
    console.error("getBlogPost error:", err)
    return null
  }
}