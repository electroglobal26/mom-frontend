"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ blog: 0, services: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/blog").then((r) => r.json()),
      fetch("/api/admin/services").then((r) => r.json()),
    ]).then(([blog, services]) => {
      setCounts({
        blog: Array.isArray(blog) ? blog.length : 0,
        services: Array.isArray(services) ? services.length : 0,
      })
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-[#0e2547]">
        Dashboard
      </h1>
      <p className="mt-1 text-[14px] text-slate-500">
        Welcome back. Here's your content overview.
      </p>

      {/* Stats */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Blog Posts", count: counts.blog, href: "/admin/blog", color: "#e61e73", icon: "✍" },
          { label: "Services", count: counts.services, href: "/admin/services", color: "#0e2547", icon: "⚡" },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-[18px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-slate-400">
                {s.label}
              </p>
              <span className="text-[20px]">{s.icon}</span>
            </div>
            <p
              className="mt-3 text-[48px] font-extrabold tracking-[-0.04em]"
              style={{ color: s.color }}
            >
              {loading ? "—" : s.count}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="mb-4 text-[16px] font-extrabold text-[#0e2547]">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/blog/new"
            className="rounded-[10px] bg-[#e61e73] px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-[#ca155f]"
          >
            + New Blog Post
          </Link>
          <Link
            href="/admin/services/new"
            className="rounded-[10px] bg-[#0e2547] px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:opacity-90"
          >
            + New Service
          </Link>
          <Link
            href="/blog"
            target="_blank"
            className="rounded-[10px] border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-bold text-[#0e2547] hover:border-[#0e2547]"
          >
            View Blog ↗
          </Link>
          <Link
            href="/services"
            target="_blank"
            className="rounded-[10px] border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-bold text-[#0e2547] hover:border-[#0e2547]"
          >
            View Services ↗
          </Link>
        </div>
      </div>
    </div>
  )
}