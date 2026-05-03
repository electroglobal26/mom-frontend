const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

export type FAQ = {
  question: string
  answer: string
}

export type BlogPost = {
  id: string
  slug: string
  title: string
  category_id: string
  featured_image: string
  image_urls: string[]
  excerpt: string
  content: string
  author_name: string
  status: string
  published_at: string
  meta_title: string
  meta_description: string
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
    category_id: p.category_id || "",
    featured_image: normalizeImagePath(p.featured_image || ""),
    image_urls: (p.image_urls || []).map(normalizeImagePath),
    excerpt: p.excerpt || "",
    content: p.content || "",
    author_name: p.author_name || "",
    status: p.status || "draft",
    published_at: p.published_at || "",
    meta_title: p.meta_title || "",
    meta_description: p.meta_description || "",
    faqs: p.faqs || [],
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/custom/blog/posts`, {
      cache: "no-store",
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
      cache: "no-store",
    })
    if (!res.ok) {
      console.error("getBlogPost failed:", res.status)
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