"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function AdminBlogList() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((d) => {
        setPosts(Array.isArray(d) ? d : [])
        setLoading(false)
      })
  }, [])

  async function deletePost(slug: string) {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/blog/${slug}`, { method: "DELETE" })
    if (res.ok) setPosts(posts.filter((p) => p.slug !== slug))
    else alert("Failed to delete post")
  }

  async function togglePublish(post: any) {
    const res = await fetch(`/api/admin/blog/${post.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: post.title,
        category: post.category,
        date: post.date,
        excerpt: post.excerpt,
        intro: post.intro,
        sections: post.sections,
        image: post.image,
        published: !post.published,
      }),
    })
    if (res.ok) {
      setPosts(posts.map((p) =>
        p.slug === post.slug ? { ...p, published: !p.published } : p
      ))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-[#0e2547]">
            Blog Posts
          </h1>
          <p className="mt-1 text-[14px]text-slate-600">
            {posts.length} total posts
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#ca155f]"
        >
          + New Post
        </Link>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-slate-400">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-slate-400">No blog posts yet.</p>
          <Link
            href="/admin/blog/new"
            className="mt-4 inline-block rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex items-center justify-between rounded-[14px] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-center gap-4">
                {/* Published indicator */}
                <div
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    post.published ? "bg-green-400" : "bg-slate-300"
                  }`}
                  title={post.published ? "Published" : "Draft"}
                />
                <div>
                  <p className="text-[15px] font-bold text-[#0e2547]">
                    {post.title}
                  </p>
                  <p className="mt-0.5 text-[12px] text-slate-400">
                    {post.category} · {post.date} ·{" "}
                    <span className={post.published ? "text-green-500" : "text-slate-400"}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePublish(post)}
                  className="rounded-[8px] border border-slate-200 px-3 py-1.5 text-[12px] font-semiboldtext-slate-600 hover:border-slate-400 transition-all"
                >
                  {post.published ? "Unpublish" : "Publish"}
                </button>
                <Link
                  href={`/admin/blog/${post.slug}`}
                  className="rounded-[8px] border border-slate-200 px-3 py-1.5 text-[12px] font-semibold text-[#0e2547] hover:border-[#0e2547] transition-all"
                >
                  Edit
                </Link>
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="rounded-[8px] border border-slate-200 px-3 py-1.5 text-[12px] font-semibold text-slate-400 hover:border-slate-400 transition-all"
                >
                  View ↗
                </Link>
                <button
                  onClick={() => deletePost(post.slug)}
                  className="rounded-[8px] border border-red-100 px-3 py-1.5 text-[12px] font-semibold text-red-400 hover:bg-red-50 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}